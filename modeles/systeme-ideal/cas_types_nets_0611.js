/*
 * modeles/systeme-ideal/cas_types_nets_0611.js — COUCHE posée sur la base de travail du 06/11/2026 (base_0611.js), NON ADOPTÉE ; ne modifie aucun module ni aucun résultat existant.
 *
 * Question (l'auteur, via Claude, 06/11/2026) : les cas types des jeux de réglages comparent le seul revenu disponible ; or l'arbitrage 49 (Sécurité sociale à 100 % sur le socle) supprime
 * la complémentaire santé obligatoire, et l'arbitrage 50 supprime les titres-restaurant. Principe : aucun prélèvement n'augmente, les sommes sont redirigées ; que reste-t-il une fois la mutuelle comptée ?
 *
 * Indicateur : REVENU APRÈS DÉPENSES CONTRAINTES DE SANTÉ ET AVANTAGES (« revenu net santé ») =
 *   revenu disponible − cotisation de complémentaire santé payée par le ménage (+ part employeur des titres-restaurant, option) ;
 *   droit actuel : part salariale du contrat collectif obligatoire et fiscalité de la part employeur (OpenFisca-France 2026, generer_cas_types_nets_0611.py),
 *                  contrat individuel (retraités, indépendant) selon l'âge (DREES, enquête OC) ; C2S participative pour le retraité au minimum vieillesse ;
 *   nouveau système : surcomplémentaire facultative à 0 au central ; variante : le ménage garde une surcomplémentaire hors panier (30 % de la prime actuelle, payée en entier par lui).
 * Coût employeur constant (HN5) : la part employeur de la complémentaire (+ forfait social) et des titres-restaurant, que l'employeur ne paie plus, est
 *   (S) versée en salaire : elle entre dans la base R du cas type (central) ; ou (C) reprise par une contribution employeur au budget commun : R inchangé, recette publique.
 * Hypothèses HN1 à HN12 (sources/cas-types-nets-sante.md § 3) ; vérifications V18200 à V18299.
 * Charger (jsc) : la liste de test_base_0611.js sans le test, puis ce fichier (ordre complet en tête de test_cas_types_nets_0611.js).
 */
(function (root) {
  'use strict';
  var B = root.BaseTravail0611, A = root.Decisions0611V74, V = root.BaremeUniqueV6, X = root.BaremeV71, I = root.Decisions0511i, DS = root.VarianteDetteStable, CT = root.CAS_TYPES_DONNEES;
  var SC = ['bas', 'central', 'haut'];   // « bas » = effet de la mutuelle le plus faible (prime basse, part employeur haute), « haut » = le plus fort

  // ======================================================================================================================================
  // 0. Données sourcées et hypothèses
  // ======================================================================================================================================
  var S = {
    // DREES, enquête auprès des organismes complémentaires (OC) : assuré de référence (personne seule, régime général, temps plein, tranche de revenus la plus basse, zone la plus chère)
    collectif2023: 74,                                  // prime mensuelle moyenne d'un contrat collectif, quel que soit l'âge, parts employeur et salarié comprises, 2023 (DREES, jeu de données du 23/09/2025)
    collectif2021: 68,                                  // idem 2021 (DREES, Études et résultats n° 1338, avril 2025)
    individuel2021: { 20: 33, 40: 59, 60: 93, 65: 104, 75: 127, 85: 146 },   // contrats individuels, €/mois, 2021 (ER 1338 ; 65 ans : panorama 2024)
    individuel2023: { 20: 36, 85: 142 },                // 2023 (DREES, 23/09/2025) ; 60 ans et plus : −2 % à +3 % depuis 2021 ; moins de 60 ans : +6 % à +9 %
    // HN1 : indexation 2023 → 2026 des primes (bas : aucune ; central : +4,5 %/an environ ; haut : +6,3 %/an) ⚠️ V18201
    index: [1.00, 1.14, 1.20],
    // HN2 : part employeur du contrat collectif (minimum légal 50 %, CSS art. L911-7) : 60 % / 55 % / 50 % ⚠️ V18202
    partEmployeur: [0.60, 0.55, 0.50],
    // HN3 : enfants couverts par le contrat du premier parent, supplément de 40 % de la prime adulte par enfant, même part employeur ⚠️ V18203
    coefEnfant: 0.4,
    // HN4 : forfait social de 8 % sur la part employeur (entreprises de 11 salariés et plus), compté dans le coût employeur constant : 0 / 8 % / 8 %
    forfaitSocial: [0, 0.08, 0.08],
    // HN6 : titres-restaurant : part employeur par bénéficiaire = assiette exemptée 5,5 Md€ (PLFSS 2026, annexe 4, 2024 p) / 6 M de salariés (CNTR) / 12
    trEmployeur: 5.5e9 / 6e6 / 12,
    // HN7 : part non transférée de la prime (hors panier : dépassements, confort) = 1 − prestations transférées / prestations des complémentaires = 1 − 23,05 / 33
    partHorsPanier: 1 - (B.S.hcaamAMO * B.S.indexCSBM) / B.S.prestAMC,
    // C2S participative, 70 ans et plus : 30 €/mois (barème 2024-2026, ameli.fr / CSS art. D861-3) ⚠️ V18206
    c2s70: 30,
    // HN8 : taux marginal d'IR sur la part employeur (imposable depuis les revenus 2013, CGI art. 83 1° quater ; OpenFisca ne l'ajoute pas au salaire imposable) ⚠️ V18204
    tmIR: { smic_seul: 0, parent_isole_smic: 0, couple_2smic_0enf: 0.11, couple_2smic_2enf: 0, couple_median_2enf: 0.11, cadre_5000: 0.30, cadre_10000: 0.41, cadre_20000: 0.41 },
    // OpenFisca-France 2026 (generer_cas_types_nets_0611.py) : variation du revenu disponible quand on renseigne la complémentaire collective (part salariale, CSG sur la part employeur,
    // déduction de la part salariale, prime d'activité) ; trois scénarios (prime adulte 74 / 84,36 / 88,8 €, part employeur 60 / 55 / 50 %, enfants 40 %)
    primeOF: [74, 74 * 1.14, 74 * 1.20],
    dRdOF: {
      smic_seul: [-25.26, -32.07, -37.12], parent_isole_smic: [-31.44, -39.27, -46.08], couple_2smic_0enf: [-42.70, -56.31, -66.40], couple_2smic_2enf: [-72.70, -92.60, -107.19],
      couple_median_2enf: [-81.86, -102.31, -117.30], cadre_5000: [-25.07, -31.38, -35.87], cadre_10000: [-21.91, -27.30, -31.21], cadre_20000: [-19.24, -23.96, -27.38]
    },
    // macro : assiette exemptée « santé et prévoyance complémentaire » 23,8 Md€ (PLFSS 2026, annexe 4) × part santé 55 % (HB6)
    santePrev: B.S.santePrevEntreprise, partSante: B.HYP.partSanteDansSantePrev
  };
  var SALARIES = B.OFFICIELS;   // huit cas types OpenFisca
  // HN9 : âges retenus (retraités : 70 ans, sauf mention ; indépendant : 40 ans)
  var RETRAITES = [
    { id: 'retraite_aspa', libelle: 'Retraité seul au minimum vieillesse (ASPA, 1 044 €), 70 ans, C2S participative', pn: 1043.59, age: 70, c2s: true },
    { id: 'retraite_1200', libelle: 'Retraité seul, 1 200 € nets de pension, 70 ans', pn: 1200, age: 70 },
    { id: 'retraite_2000', libelle: 'Retraité seul, 2 000 € nets de pension, 70 ans', pn: 2000, age: 70 },
    { id: 'retraite_2000_85', libelle: 'Retraité seul, 2 000 € nets de pension, 85 ans', pn: 2000, age: 85 },
    { id: 'retraite_4000', libelle: 'Retraité seul, 4 000 € nets de pension, 70 ans', pn: 4000, age: 70 }
  ];

  /** Prime individuelle mensuelle (€, 2023) à l'âge a : 2023 si publiée ; sinon 2021, × 1,075 sous 60 ans (milieu de +6 / +9 %), × 1 à 60 ans et plus ; interpolation linéaire entre âges publiés. */
  function primeIndividuelle2023(a) {
    var t = {}, k; for (k in S.individuel2021) t[k] = S.individuel2021[k] * (k < 60 ? 1.075 : 1);
    for (k in S.individuel2023) t[k] = S.individuel2023[k];
    var ages = Object.keys(t).map(Number).sort(function (x, y) { return x - y; });
    if (a <= ages[0]) return t[ages[0]]; if (a >= ages[ages.length - 1]) return t[ages[ages.length - 1]];
    for (var i = 1; i < ages.length; i++) if (a <= ages[i]) return t[ages[i - 1]] + (t[ages[i]] - t[ages[i - 1]]) * (a - ages[i - 1]) / (ages[i] - ages[i - 1]);
  }
  function primeIndividuelle(a, k) { return primeIndividuelle2023(a) * S.index[k]; }
  function primeCollective(k) { return S.collectif2023 * S.index[k]; }

  /** Structure de la mutuelle collective d'un cas type salarié au scénario k : primes par adulte (le premier porte les enfants), parts employeur. */
  function mutuelleCollective(id, k) {
    var o = I.HYP.OF_CAS[id], n = o.brut.length, e = o.enfants, p = primeCollective(k), pe = S.partEmployeur[k];
    var primes = o.brut.map(function (b, i) { return p * (1 + (i === 0 ? S.coefEnfant * e : 0)); });
    var emp = primes.map(function (x) { return x * pe; }), tot = primes.reduce(function (a, x) { return a + x; }, 0), empTot = emp.reduce(function (a, x) { return a + x; }, 0);
    return { primes: primes, employeur: emp, total: tot, employeurTotal: empTot, salarie: tot - empTot, n: n };
  }
  /** Revenu disponible actuel avec la mutuelle : OpenFisca (dRdOF) + IR sur la part employeur (HN8). */
  function coutMutuelleActuel(id, k) { var m = mutuelleCollective(id, k); return -S.dRdOF[id][k] + S.tmIR[id] * m.employeurTotal; }

  // ======================================================================================================================================
  // 1. Barèmes : base de travail, jeu (a), jeu (c) (mêmes constructions que export_bilan_base0611.js)
  // ======================================================================================================================================
  var _j = null;
  function jeux() {
    if (_j) return _j;
    var T = B.totaux(), manque = B.dette(T.central).manque.reference, ja = B.jeuRevenus(manque), jp = B.jeuPatrimoine(0.04), eco = B.S.solideo + B.S.cojo, jc = B.jeuRevenus(manque - jp.delta - eco);
    _j = { manque: manque, T: T, base: { nom: 'base', bareme: B.bareme0() }, a: { nom: 'a', bareme: ja.bareme, param: ja.param, recette: ja.recette },
           c: { nom: 'c', bareme: jc.bareme, param: jc.param, recette: jc.recette, patrimoine: jp.delta, economies: eco }, R1f: true };
    return _j;
  }
  function revenu(q, spec) { return V.menage(A.sched(q), spec, X.HYP.regle).revenu; }
  function specSalarie(id, extra) {
    var o = I.HYP.OF_CAS[id], sp = I.spec(id), n = o.brut.length, tb = o.brut.reduce(function (a, x) { return a + x; }, 0);
    var revenus = o.brut.map(function (b, i) { return o.superBrut * b / tb + (extra ? extra[i] : 0); });
    return { revenus: revenus, enfants: sp.enfants, situation: n === 2 ? 'couple' : (sp.enfants > 0 ? 'parent' : 'seul') };
  }

  // ======================================================================================================================================
  // 2. Cas types
  // ======================================================================================================================================
  /**
   * opts : { k: 0|1|2 (scénario, défaut 1), mode: 'S' (salaire, défaut) | 'C' (contribution employeur), surcomplementaire: bool, titres: bool }
   * Rend, pour chaque cas : avant (revenu disponible), avantNet (revenu net santé), et pour base / a / c : rd (revenu disponible publié, R = super-brut OpenFisca) et net.
   */
  function casTypes(opts) {
    opts = opts || {}; var k = opts.k === undefined ? 1 : opts.k, mode = opts.mode || 'S', sc = !!opts.surcomplementaire, tr = !!opts.titres, J = jeux(), out = [];
    var ref = {}; B.casTypesCorriges().forEach(function (c) { ref[c.id] = c; });
    SALARIES.forEach(function (id) {
      var m = mutuelleCollective(id, k), av = ref[id].avant, trE = tr ? S.trEmployeur : 0;
      var avantNet = av - coutMutuelleActuel(id, k) + trE * m.n;
      var extra = m.employeur.map(function (e) { return mode === 'S' ? e * (1 + S.forfaitSocial[k]) + trE : trE; });
      var surc = sc ? S.partHorsPanier * m.total : 0, c = { id: id, libelle: I.HYP.OF_CAS[id].libelle, type: 'salarie', avant: av, avantNet: avantNet, mutuelle: m, coutMutuelle: coutMutuelleActuel(id, k) };
      ['base', 'a', 'c'].forEach(function (j) {
        var q = J[j].bareme, rd = revenu(q, specSalarie(id)), net = revenu(q, specSalarie(id, extra)) - surc;
        c[j] = { rd: rd, net: net, ecartRd: rd - av, ecartNet: net - avantNet, pctRd: (rd - av) / av, pctNet: (net - avantNet) / avantNet };
      });
      out.push(c);
    });
    // indépendant : micro-entrepreneur libéral (cas_types_donnees.js), contrat individuel à 40 ans (non déductible en micro)
    var ind = CT.filter(function (x) { return x.id === 'independant'; })[0], Ri = ind.micro_ca * (1 - ind.charges_reelles_part), pI = primeIndividuelle(40, k), ci = { id: 'independant', type: 'independant',
      libelle: 'Indépendant (micro-entrepreneur libéral, 3 000 € de CA, R = ' + Ri + ' €), 40 ans, contrat individuel', avant: ind.actuel.revenu_disponible, coutMutuelle: pI };
    ci.avantNet = ci.avant - pI;
    ['base', 'a', 'c'].forEach(function (j) { var rd = revenu(J[j].bareme, { revenus: [Ri] }), net = rd - (sc ? S.partHorsPanier * pI : 0);
      ci[j] = { rd: rd, net: net, ecartRd: rd - ci.avant, ecartNet: net - ci.avantNet, pctRd: (rd - ci.avant) / ci.avant, pctNet: (net - ci.avantNet) / ci.avantNet }; });
    out.push(ci);
    // retraités : pension nette constante (consigne de l'auteur, H84 / H72.4) ; jeux (a) et (c) avec la combinaison (R1f : sous-indexation au-dessus de 2 500 € nets)
    RETRAITES.forEach(function (r) {
      var p = r.c2s ? S.c2s70 : primeIndividuelle(r.age, k), c = { id: r.id, libelle: r.libelle, type: 'retraite', avant: r.pn, avantNet: r.pn - p, coutMutuelle: p };
      var r1 = DS.perteIndiv('R1f', r.pn, 0);
      ['base', 'a', 'c'].forEach(function (j) { var rd = r.pn - (j === 'base' ? 0 : r1), net = rd - (sc ? S.partHorsPanier * p : 0);
        c[j] = { rd: rd, net: net, ecartRd: rd - r.pn, ecartNet: net - c.avantNet, pctRd: (rd - r.pn) / r.pn, pctNet: (net - c.avantNet) / c.avantNet }; });
      c.perteR1f = r1;
      // sensibilité : si la caisse versait une pension brute fixe (regroupée sous le barème de la base), l'effet du jeu sur le net
      var x = V.regrouper(A.sched(B.bareme0()), r.pn); c.siCaisseFixe = { a: (x + A.sched(J.a.bareme).S - A.sched(J.a.bareme).T(x)) - r.pn, c: (x + A.sched(J.c.bareme).S - A.sched(J.c.bareme).T(x)) - r.pn };
      out.push(c);
    });
    return out;
  }

  // ======================================================================================================================================
  // 3. Cible de répartition validée (H71.8) : bas revenus ≥ +20 €/mois ; haut −1 à −3 %
  // ======================================================================================================================================
  var BAS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf'], HAUT = ['cadre_10000', 'cadre_20000'];
  function cible(cas, j, champ) {
    var o = {}; cas.forEach(function (c) { o[c.id] = c; }); champ = champ || 'Net';
    var bas = BAS.map(function (id) { return { id: id, ecart: o[id][j]['ecart' + champ], ok: o[id][j]['ecart' + champ] >= 20 }; });
    var haut = HAUT.map(function (id) { var p = o[id][j]['pct' + champ]; return { id: id, pct: p, ok: p <= -0.01 + 1e-9 && p >= -0.03 - 1e-9 }; });
    return { bas: bas, haut: haut, basOk: bas.every(function (x) { return x.ok; }), hautOk: haut.every(function (x) { return x.ok; }) };
  }

  // ======================================================================================================================================
  // 4. Macro : part employeur de la complémentaire (BT08) et manque à financer en prélèvements élargis
  // ======================================================================================================================================
  /** Part employeur de la complémentaire santé (Md€/an) : assiette exemptée santé et prévoyance × part santé ; bornes 50 % / 60 %. */
  function partEmployeurMacro() { return [S.santePrev * 0.50, S.santePrev * S.partSante, S.santePrev * 0.60]; }
  /** Coût net de la Sécurité sociale à 100 % dans le solde (Md€/an, > 0 = creuse) : BT04 + BT05 + BT06 + BT07, par scénario de la base. */
  function secuNette() {
    var L = B.lignes(), ids = ['BT04', 'BT05', 'BT06', 'BT07'];
    return [0, 1, 2].map(function (k) { return -L.filter(function (l) { return ids.indexOf(l.id) >= 0; }).reduce(function (a, l) { return a + l.v[k]; }, 0); });
  }
  /**
   * Manque à financer (macro de référence, avec la combinaison, Md€/an) :
   *  officiel (base) ; (S) si la part employeur est hors de D121 et convertie en salaire (taxée au marginal 0,50) ; (C) contribution employeur santé au budget commun ;
   *  « PO élargis » : la part de la hausse de la fonction des revenus qui finance la Sécurité sociale à 100 % n'est pas comptée comme un prélèvement nouveau (elle remplace des cotisations de mutuelle).
   */
  function manques() {
    var J = jeux(), T = J.T.central, pe = partEmployeurMacro(), sn = secuNette(), d = function (x) { return B.dette(T + x).manque; };
    var out = { officiel: d(0), salaireHorsD121: d(pe[1] * B.HYP.tMarginalSalaires[1]), contribution: d(pe[1]), poElargis: d(sn[1]), poElargisEtContribution: d(sn[1] + pe[1]),
                partEmployeur: pe, secuNette: sn };
    // fourchettes selon les lignes de la base (favorable / central / défavorable), macro de référence
    out.officielLignes = [B.dette(J.T.bas).manque.reference, out.officiel.reference, B.dette(J.T.haut).manque.reference];
    out.poElargisLignes = [B.dette(J.T.bas + sn[0]).manque.reference, out.poElargis.reference, B.dette(J.T.haut + sn[2]).manque.reference];
    // variation des prélèvements élargis (Md€/an) entre aujourd'hui et le jeu (a) : + fonction des revenus (manque) − contrats collectifs obligatoires disparus (HB10)
    out.collectifsDisparus = B.S.partCollectifs.map(function (p) { return B.S.cotisAMC * p; });
    out.deltaPOelargisJeuA = J.a.recette - out.collectifsDisparus[1];
    // primes évitées sur le panier (toutes complémentaires) : 70 % de 46,5
    out.primesPanier = B.S.cotisAMC * (1 - S.partHorsPanier);
    return out;
  }

  var API = { S: S, SC: SC, SALARIES: SALARIES, RETRAITES: RETRAITES, BAS: BAS, HAUT: HAUT, primeIndividuelle2023: primeIndividuelle2023, primeIndividuelle: primeIndividuelle,
              primeCollective: primeCollective, mutuelleCollective: mutuelleCollective, coutMutuelleActuel: coutMutuelleActuel, jeux: jeux, revenu: revenu, specSalarie: specSalarie,
              casTypes: casTypes, cible: cible, partEmployeurMacro: partEmployeurMacro, secuNette: secuNette, manques: manques };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CasTypesNets0611 = API;
})(this);
