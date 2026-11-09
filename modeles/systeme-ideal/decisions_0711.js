/*
 * modeles/systeme-ideal/decisions_0711.js — COUCHE DATÉE DECISIONS0711 : le système arrêté du 07/11/2026 (décisions de l'auteur du 07/11/2026).
 * Posée sur la base de travail consolidée (base_0611.js + consolidation_0611.js, Urssaf CS01 comprise), sans modifier aucun module existant.
 *
 *   58 : scénario S3 (bascule neutre, leviers votés montés linéairement de 2029 à 2038, dette / PIB stable à partir de 2038, macro de référence) ;
 *   59 : COURBE DES PENSIONS, sur le modèle de la fonction des revenus, à la place de la contribution de 20 % au-dessus de 2 500 € :
 *        C_p(P) = 0 si P ≤ P_g ; sinon C_p(P) = m_p × [ (P − P_g) − K_p × (1 − e^(−(P − P_g)/K_p)) ]
 *        (P = pension nette actuelle, mensuelle ; le taux marginal monte sans à-coup de 0 au seuil de garantie P_g vers m_p, avec la même forme exponentielle
 *        et la même constante K = 1 500 € que la fonction des revenus) ; garantie de non-perte sous P_g ; minimum vieillesse garanti par le plancher ;
 *        revenus du capital des retraités dans la fonction des revenus normale (empilés sur la pension, comme dans la base : aucun prélèvement en plus) ;
 *   60 : transmissions, abattement de 300 000 € (TR01) avec l'impôt de suite (TR02, TR03), comme dans S3 ;
 *   61 : crédit d'IS à 50 % ; le capital n'ouvre aucun droit social (sans effet de solde : la garantie et les retraites se calculent déjà sur l'activité) ;
 *   62 : TVA 5 / 10 / 20 % : alimentation de base, eau et médicaments à 5 % au lieu du 0 % de N17 ; viande, poisson, boissons de 5,5 à 5 % ;
 *   63 : patrimoine v7.5 (déjà dans la base : ligne BT01 ; effet supplémentaire nul) ;
 *   56, 57, 64, 68 : garantie de transition, arrêts maladie, pont vers la retraite (garantie_transition.js, couche GT0711) : budget en QUATRE VALEURS (a, b, c et gtc_droite) ;
 *        gtc_droite (arbitrage 68, coût constant en ligne droite) est la valeur PAR DÉFAUT (HYP.defaut) ; le comportement n'y est pas compté (sensibilité) ;
 *   65 : frais professionnels au réel automatique (estimation, hypothèse marquée) ; 66 : crèches gardées ; 67 : capitaux mobiliers fondus pour les résidents.
 * Hypothèses HD1 à HD12 : bilan global (document de travail non publié), § 00000 ; vérifications V20000 à V20099. Fonctions pures.
 * Charger (jsc) : la liste de rapport_consolidation_0611.js (sans le rapport), puis ce fichier, puis rapport_decisions_0711.js ou test_decisions_0711.js.
 */
(function (root) {
  'use strict';
  var R = root.RetraitesAisees0611, K = root.Consolidation0611, T = root.Transmissions0611, B = root.BaseTravail0611, Y = root.Decisions0611V72,
      DS = root.VarianteDetteStable, N = root.CasTypesNets0611, FO = root.FiscaliteOrientation;

  // ====================================================================================================================
  // 0. Paramètres
  // ====================================================================================================================
  var HYP = {
    // HD1 : courbe des pensions : seuil de garantie de non-perte 2 000 € nets par mois (≈ 67 % des retraités dessous, EIR 2020 revalorisé) ;
    //       K_p = 1 500 € (celui de la fonction des revenus) ; m_p calibré pour rapporter autant que la contribution de 20 % au-dessus de 2 500 € (pension seule, 6,27 Md€)
    pension: { Pg: 2000, K: 1500, m: null },
    variantesPension: [ { Pg: 1500, K: 1500 }, { Pg: 2000, K: 1500 }, { Pg: 2500, K: 1500 } ],
    contribRef: { seuil: 2500, taux: 0.2, capital: false },
    // HD2 : la sous-indexation R1f des hautes pensions reste dans la combinaison de S3 (comme le 06/11) et s'ajoute à la courbe dans les cas types
    // HD3 : TVA : élasticités du modèle de fiscalité d'orientation ; favorable = « bas », central = « haut » (N17 est compté avec les réactions fortes), défavorable = « haut »
    //       avec effet de report sur le reste de la consommation (taux de taxe 9 %, H14) ; répercussion entière dans les prix (H9)
    tva: { nouveau: 0.05 },
    // HD4 : postes de la TVA (Md€ TTC 2024, Insee, comptes nationaux base 2020, T_CONSO_EFF_FONCTION, feuille MEURcour ; modeles/fiscalite-orientation/donnees/consommation_menages_2024.csv)
    postesTva: [
      { id: 'TV01', lib: 'Alimentation hors viande et poisson (CP011 − CP0112 − CP0113 = 171,922 − 33,338 − 7,332)', conso: 131.252, r0: 0.055, depuisZero: true, cle: 'alimentation' },
      { id: 'TV02', lib: 'Eau (réseau CP0441 5,090 + bouteille CP0125 2,670)', conso: 7.760, r0: 0.055, depuisZero: true, cle: 'eau' },
      { id: 'TV03', lib: 'Médicaments et produits de santé à la charge des ménages (CP061 ; taux moyen actuel 5,9 % entre 2,1 et 10 %)', conso: 21.610, r0: 0.059, depuisZero: true, cle: 'medicaments' },
      { id: 'TV04', lib: 'Viande et poisson (CP0112 + CP0113 = 40,670) : 5,5 % → 5 %', conso: 40.670, r0: 0.055, depuisZero: false, e: [0.4, 0.59, 0.8] },
      { id: 'TV05', lib: 'Boissons non alcoolisées hors eau en bouteille (CP012 − CP0125 = 15,894 − 2,670) : 5,5 % → 5 %', conso: 13.224, r0: 0.055, depuisZero: false, e: [0.3, 0.59, 0.8] }
    ],
    // HD5 : cas types (dépense d'alimentation hors viande et poisson) : Budget de famille 2017 par décile (TF106), recalé sur les comptes nationaux 2024 ;
    //       ménage moyen 1,5 unité de consommation ⚠️ ; Smic seul au 3e décile (1 UC), couple à deux Smic avec deux enfants au 4e décile (2,1 UC)
    ucMoyen: 1.5, casTva: [ { id: 'smic_seul', decile: 3, uc: 1 }, { id: 'couple_2smic_2enf', decile: 4, uc: 2.1 }, { id: 'couple_median_2enf', decile: 6, uc: 2.1 } ],
    // HD6 : capitaux mobiliers (C08, P11 = 3,884) : part des résidents 50 / 75 / 100 % (composition non lue, V16510) ; la retenue sur les non-résidents reste
    rcm: { total: 3.884, partResidents: [0.5, 0.75, 1.0] },
    // HD7 : crèches gardées (C11 : prestations de service, 2,221)
    creches: 2.221,
    // HD8 : frais professionnels au réel automatique : la base du modèle est le revenu économique (réel) ; un forfait aurait coûté ≈ 1 à 4 Md€ (non compté) ;
    //       favorable +0,5 (recettes révélées par la facture électronique), défavorable −1,0 (dépenses privées passées en charges malgré l'outil) ⚠️
    fraisReels: [0.5, 0.0, -1.0],
    // HD9 : garantie de transition (couche GT0711, garantie_transition.js) : trois budgets ; arrêts maladie sans reprise des compléments par défaut ; pont dans les trois
    gt: {
      budgetModele: 12.5605,
      a: { lib: '(a) budget du modèle actuel, 12,56 Md€ (100 %, 18 mois, λ = +4,19, ouverture comprise)', supplement: 12.560499955857960, comportement: [1.0829106649201365, 1.0829106649201365, 1.0829106649201365] },
      b: { lib: '(b) ≈ 25 Md€ sur 18 mois (100 %, λ = +0,17, ouverture comprise ; recommandation du dossier)', supplement: 25, comportement: [-2.7343517617448083, -2.7343517617448083, -2.7343517617448083] },
      c: { lib: '(c) coût égal à l\'assurance chômage, 37,1 Md€ (courbe A : 100 %, 24 mois, λ = −1,12)',
           supplementParts: [[30.519106821344963, 31.868786658414717, 33.15215658402681], [2.289456307185999, 3.9711430957874145, 7.5898239407808115], [0.5813734305075071, 1.260070159002889, 2.638618466513767]],
           comportement: [-2.024956023605726 - 0.20550327651626094, -6.606987817351047 - 1.1552588731606799, -14.576268856281391 - 4.837591243688147] },
      // (gtc_droite) variante « coût constant » en ligne droite (arbitrage 68 ; sources/garantie-transition.md § 12 ; couche GTC1-GTC4 de bilan_global.py) :
      //   12 mois, un mois de droits pour deux mois travaillés, pont des 50 ans et plus, arrêts maladie 0 / 10 / 20 % puis 60 % dès le 4e jour (sans reprise des compléments) ;
      //   versé 28,7 Md€ contre 49,2 aujourd'hui ; colonnes [favorable, central, défavorable] = réactions faibles / centrales / fortes ;
      //   le comportement (sorties plus rapides : +1,93 / +5,91 / +13,68) n'est PAS compté dans le chiffrage de référence : sensibilité seulement (opts.extra)
      gtc_droite: {
        lib: '(gtc_droite) coût constant, courbe en ligne droite : 12 mois, un mois de droits pour deux mois travaillés (28,7 Md€ versés contre 49,2 aujourd\'hui)',
        garantie: [14.828710413145679, 15.520977719682406, 17.182092217652894],
        maladie: [12.156590625, 12.166734374999999, 12.18575], iJActuelles: 12.1,
        pont: [1.0229336522058978, 0.9999999876496617, 0.9748195489772103], pontRecettes: [-0.18382248999403802, -0.2740508860698854, -0.362948474989968],
        comportement: [1.9274875237171734, 5.9092673241229825, 13.679641134985966]
      },
      maladieSansReprise: [2.018775, 3.0232599999999996, 4.145150000000001],
      maladieAvecReprise: [4.734799999999999, 7.771734999999999, 11.521075],
      pont: { surcout: [0.9398897844468712, 0.9999999894618694, 1.0712781485338707], recettes: [-0.21450306711997807, -0.3289786564478636, -0.4393225779237771] }
    },
    // HD10 : S3 : mêmes leviers que le 06/11 (consolidation_0611.js s3) : R1f, M1f, M2m, M3, recouvrement retiré, Urssaf ; rampe 2029-2038 pour transmissions, impôt de suite,
    //        courbe des pensions, crédit d'IS 50 %, économies de niveaux 1 et 2, fonction des revenus ; les décisions de structure (TVA, crèches, capitaux mobiliers, frais,
    //        garantie) s'appliquent à la bascule (constantes dès 2029, convention de la base)
    credit: 0.5,
    // valeur de HYP.gt par défaut : variante coût constant en ligne droite (arbitrage 68)
    defaut: 'gtc_droite'
  };

  // ====================================================================================================================
  // 1. Courbe des pensions (arbitrage 59)
  // ====================================================================================================================
  function Cp(P, o) { if (P <= o.Pg) return 0; var x = P - o.Pg; return o.m * (x - o.K * (1 - Math.exp(-x / o.K))); }
  function marginalP(P, o) { return P <= o.Pg ? 0 : o.m * (1 - Math.exp(-(P - o.Pg) / o.K)); }
  /** Recette annuelle (Md€) de la courbe o au scénario k (fuite sur les pensions 3 / 8 / 15 %, comme la contribution ; HRA3). */
  function recettePension(o, k) {
    k = k === undefined ? 1 : k; var s = 0, nc = 0, masse = 0;
    R.points().forEach(function (p) { var c = Cp(p.pn, o); s += p.w * c; masse += p.w * p.pn; if (c > 0) nc += p.w; });
    var f = 12 * R.S.nRetraites / 1e9;
    return { brute: s * f, net: s * f * (1 - R.HYP.fuitePension[k]), concernes: nc * R.S.nRetraites, partConcernes: nc, partMasse: s / masse };
  }
  /** m_p tel que la courbe (Pg, K) rapporte `cible` Md€ (central). */
  function calibrerM(Pg, Kp, cible) {
    var lo = 0, hi = 0.99; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (recettePension({ Pg: Pg, K: Kp, m: m }, 1).net < cible) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  var _courbe = null;
  function courbe() {
    if (_courbe) return _courbe;
    var cible = R.recette(HYP.contribRef, 1).net, o = { Pg: HYP.pension.Pg, K: HYP.pension.K, m: calibrerM(HYP.pension.Pg, HYP.pension.K, cible) };
    _courbe = { o: o, cible: cible };
    return _courbe;
  }
  function variantesPension() {
    var cible = R.recette(HYP.contribRef, 1).net;
    return HYP.variantesPension.map(function (v) { var o = { Pg: v.Pg, K: v.K, m: calibrerM(v.Pg, v.K, cible) }; return { o: o, r: [0, 1, 2].map(function (k) { return recettePension(o, k); }) }; });
  }
  /** Retraité seul de pension nette pn, 70 ans, sans capital : écart au droit actuel en revenu net santé (mutuelle comptée), courbe et R1f. */
  function casRetraite(pn, o, sansR1f) {
    var prime = N.primeIndividuelle(R.S.ageCas, 1), r1 = sansR1f ? 0 : DS.perteIndiv('R1f', pn, 0), c = o ? Cp(pn, o) : 0, avantNet = pn - prime;
    return { pn: pn, prime: prime, r1f: r1, courbe: c, avantNet: avantNet, ecartNet: prime - r1 - c, pctNet: (prime - r1 - c) / avantNet, contribution20: R.contributionIndiv(pn, 0, HYP.contribRef).total };
  }
  /** Pension à partir de laquelle le retraité (sans capital, R1f compris) perd par rapport à aujourd'hui. */
  function pensionBascule(o) {
    var lo = 1000, hi = 50000; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (casRetraite(m, o).ecartNet > 0) lo = m; else hi = m; } return (lo + hi) / 2;
  }
  /** Taux marginal total sur un euro de revenu du capital d'un retraité (fonction des revenus de la base, empilée sur la pension) : la courbe n'y touche pas. */
  function marginalCapitalRetraite(pn) { return R.marginalCapital(pn); }

  // ====================================================================================================================
  // 2. TVA (arbitrage 62)
  // ====================================================================================================================
  var SCE = ['bas', 'haut', 'haut'];
  /** Passage du taux r0 (droit actuel) au taux r1 : recette nette (Md€, + améliore), volume et report de budget compris (méthode de modeles/fiscalite-orientation, effetTvaZero généralisée). */
  function changementTva(C, r0, r1, e) {
    var f = (1 + r1) / (1 + r0), q = Math.pow(f, -e), C1 = C * f * q, tva1 = C1 * r1 / (1 + r1), tva0 = C * r0 / (1 + r0), budget = -FO.DONNEES.tauxTaxeReste * (C1 - C);
    return { net: tva1 - tva0 + budget, prix: f - 1, volume: q - 1, tva0: tva0, tva1: tva1, budget: budget };
  }
  function elast(p, k) { return p.e ? p.e[k] : FO.DONNEES.tvaZero[p.cle].e[SCE[k]]; }
  /** Lignes TVA : écart au solde de la base (qui compte N17, donc le 0 %) ; et écart au droit actuel (pour mémoire). */
  function tva() {
    var lignes = HYP.postesTva.map(function (p) {
      var v = [0, 1, 2].map(function (k) {
        var e = elast(p, k), a5 = changementTva(p.conso, p.r0, HYP.tva.nouveau, e), a0 = changementTva(p.conso, p.r0, 0, e);
        return { base: p.depuisZero ? a5.net - a0.net : a5.net, actuel: a5.net, zero: a0.net };
      });
      var ord = function (a) { return [Math.max(a[0], a[1], a[2]), a[1], Math.min(a[0], a[1], a[2])]; };   // central = réactions fortes (comme N17) ; favorable >= central >= défavorable
      return { id: p.id, lib: p.lib, conso: p.conso, r0: p.r0, v: ord(v.map(function (x) { return x.base; })), actuel: ord(v.map(function (x) { return x.actuel; })), zero: v.map(function (x) { return x.zero; }) };
    });
    var tot = [0, 1, 2].map(function (k) { return lignes.reduce(function (a, l) { return a + l.v[k]; }, 0); });
    var totActuel = [0, 1, 2].map(function (k) { return lignes.reduce(function (a, l) { return a + l.actuel[k]; }, 0); });
    var alim = lignes[0];
    return { lignes: lignes, total: tot, totalActuel: totActuel, alimentation: alim };
  }
  /** Effet de la TVA alimentaire à 5 % sur les cas types modestes (€/mois) : par rapport au 0 % de N17 et par rapport au droit actuel (5,5 %). */
  function tvaCasTypes() {
    var cle = FO.DONNEES.tvaZero.alimentation.cle, moy = cle.reduce(function (a, x) { return a + x; }, 0) / 10, echelle = HYP.postesTva[0].conso * 1e9 / (FO.DONNEES.menages * moy);
    return HYP.casTva.map(function (c) {
      var dep = cle[c.decile - 1] * echelle * c.uc / HYP.ucMoyen / 12;   // dépense TTC mensuelle au taux actuel (5,5 %)
      return { id: c.id, depense: dep, vsZero: dep * (1.05 / 1.055 - 1 / 1.055), vsActuel: dep * (1.05 / 1.055 - 1) };
    });
  }

  // ====================================================================================================================
  // 3. Lignes de la couche (écart au solde de la base consolidée ; [favorable, central, défavorable], + améliore)
  // ====================================================================================================================
  function gtLignes(v, avecReprise) {
    v = v || HYP.defaut; var g = HYP.gt, sup, comp;
    if (v === 'gtc_droite') {
      var q = g.gtc_droite, zero = [0, 0, 0];
      return [
        { id: 'DG01', poste: 'Garantie de transition ' + q.lib + ' : garantie versée au-dessus du plancher, au lieu du complément de D02 (12,56)', v: q.garantie.map(function (x) { return g.budgetModele - x; }), sens: 'dep', cote: 'B' },
        { id: 'DG02', poste: 'Garantie : comportement (sorties plus rapides, la garantie étant plus courte que l\'ARE), NON COMPTÉ dans le chiffrage de référence, voir la sensibilité', v: zero.slice(), sens: 'dep', cote: 'C' },
        { id: 'DG03', poste: 'Arrêts maladie dans le même circuit (0 / 10 / 20 % puis 60 % dès le 4e jour), sans reprise des compléments ; consultations évitées déduites, écart aux IJ actuelles de 12,1', v: q.maladie.map(function (x) { return q.iJActuelles - x; }), sens: 'dep', cote: 'C' },
        { id: 'DG04', poste: 'Pont vers la retraite à partir de 50 ans (κ = 1,71, surcoût de 1 Md€, non-emploi allongé compris)', v: [0, 1, 2].map(function (k) { return -(q.pont[k] - q.pontRecettes[k]); }), sens: 'dep', cote: 'C' }
      ];
    }
    if (v === 'c') { sup = [0, 1, 2].map(function (k) { return g.c.supplementParts.reduce(function (a, x) { return a + x[k]; }, 0); }); comp = g.c.comportement; }
    else { sup = [g[v].supplement, g[v].supplement, g[v].supplement]; comp = g[v].comportement; }
    var mal = avecReprise ? g.maladieAvecReprise : g.maladieSansReprise;
    return [
      { id: 'DG01', poste: 'Garantie de transition ' + g[v].lib + ' : supplément au-dessus du plancher, au lieu du complément de D02 (12,56)', v: sup.map(function (x) { return g.budgetModele - x; }), sens: 'dep', cote: v === 'c' ? 'B' : 'C' },
      { id: 'DG02', poste: 'Garantie : non-emploi plus long (plancher versé, contribution perdue), net de l\'éviction', v: comp.slice(), sens: 'dep', cote: 'B' },
      { id: 'DG03', poste: 'Arrêts maladie dans le même circuit, ' + (avecReprise ? 'avec' : 'sans') + ' reprise des compléments employeurs et de prévoyance', v: mal.map(function (x) { return -x; }), sens: 'dep', cote: 'C' },
      { id: 'DG04', poste: 'Pont vers la retraite à partir de 50 ans (surcoût calibré à 1 Md€, plus le non-emploi allongé)', v: [0, 1, 2].map(function (k) { return -(g.pont.surcout[k] - g.pont.recettes[k]); }), sens: 'dep', cote: 'C' }
    ];
  }
  function lignesFixes() {
    var t = tva(), rc = HYP.rcm;
    var L = t.lignes.map(function (l) { return { id: l.id, poste: 'TVA à 5 % : ' + l.lib, v: l.v, sens: 'po', cote: 'B' }; });
    L.push({ id: 'DC01', poste: 'Capitaux mobiliers : prélèvements des résidents fondus dans la fonction des revenus (C08 ; retenue sur les non-résidents gardée)', v: rc.partResidents.map(function (p) { return -p * rc.total; }), sens: 'po', cote: 'C' });
    L.push({ id: 'DC02', poste: 'Crèches : prestations de service gardées (C11)', v: [-HYP.creches, -HYP.creches, -HYP.creches], sens: 'dep', cote: 'A' });
    L.push({ id: 'DC03', poste: 'Frais professionnels au réel, calculés automatiquement (la base du modèle est déjà le revenu réel ; un forfait aurait coûté ≈ 1 à 4 Md€)', v: HYP.fraisReels.slice(), sens: 'po', cote: 'D' });
    L.push({ id: 'DC04', poste: 'Patrimoine v7.5 adoptée (déjà dans la base : BT01)', v: [0, 0, 0], sens: 'po', cote: 'B' });
    return L;
  }
  function lignes(v, avecReprise) { v = v || HYP.defaut; return lignesFixes().concat(gtLignes(v, avecReprise)); }
  function somme(L) { return [0, 1, 2].map(function (k) { return L.reduce(function (a, l) { return a + l.v[k]; }, 0); }); }
  function poCouche(L) { return L.filter(function (l) { return l.sens === 'po'; }).reduce(function (a, l) { return a + l.v[1]; }, 0); }

  // ====================================================================================================================
  // 4. S3 du système arrêté (même construction que consolidation_0611.js s3, la courbe des pensions à la place de la contribution, les lignes de la couche à la bascule)
  // ====================================================================================================================
  function pic(t) { var p = 0, a = 0; t.ratio.forEach(function (x, i) { if (i < 30 && x > p) { p = x; a = 2029 + i; } }); return { pic: p, an: a }; }
  function dep3(t) { var a = null; t.deficit.forEach(function (d, i) { if (i < 30 && d > 0.03) a = 2029 + i; }); return a; }
  function s3(v, opts) {
    opts = opts || {}; v = v || HYP.defaut;
    var m = opts.macro || 'reference', L = lignes(v, opts.avecReprise), e = somme(L)[1] + (opts.extra || 0);
    var lc0 = Y.leviers(['R1f', 'M1f', 'M2m', 'M3']), u = K.urssaf().v[1] + e, r = R.S.rampe, i0 = r[1] - 2029;
    var lc = function (s, y) { return lc0(s, y) - K.recouvrement('M1f', y).total + u; }, ramp = function (y) { return Math.max(0, Math.min(1, (y - r[0]) / (r[1] - r[0]))); };
    var traj = function (F, mm) { return R.trajReforme(function (s, y) { return lc(s, y) + ramp(y) * F; }, mm || m); };
    var ok = function (F) { var t = traj(F); for (var i = i0 + 1; i < 30; i++) if (t.ratio[i] > t.ratio[i0] + 1e-9) return false; return true; };
    var lo = -100, hi = 400; for (var k = 0; k < 55; k++) { var x = (lo + hi) / 2; if (ok(x)) hi = x; else lo = x; } var F = hi;
    var co = courbe().o, tr = T.recette({ A: R.S.transReco.A, K: R.S.transReco.K, top: true, k: 1, nationalite: 'court' }).netActuel, rp = recettePension(co, 1).net, eco = R.S.ecoFonct + R.S.eco2[1];
    var autres = tr + R.S.patrimoineNat + rp + eco, f = R.aPourRecette(F - autres, HYP.credit), t = traj(F), p = pic(t);
    var prel = f.revenus + f.credit + tr + R.S.patrimoineNat + rp + poCouche(L), poMd = R.S.poBase + prel;
    var cas = T.objet(T.casTypesNets(f.bareme, HYP.credit)), ret = R.CAS.map(function (pn) { return casRetraite(pn, co, false); });
    return { v: v, macro: m, effetCouche: e, lignes: L, F: F, a: f.a, revenus: f.revenus, credit: f.credit, transmissions: tr, patrimoineNat: R.S.patrimoineNat, pension: rp, eco: eco,
             traj: t, pic: p.pic, picAn: p.an, dep3: dep3(t), po: { md: poMd, pct: poMd / R.S.pib, elargisPct: (poMd + R.S.ecartElargis) / R.S.pib }, cas: cas, retraites: ret, bareme: f.bareme,
             neutre: R.margeNeutre(function (s, y) { return lc(s, y) + ramp(y) * F; }),
             trajPrudente: traj(F, 'prudente') };
  }
  /** Même F qu'en référence, rejoué en macro prudente ; et F qu'il faudrait en macro prudente pour la même règle. */
  function prudente(v, opts) { v = v || HYP.defaut; var o = JSON.parse(JSON.stringify(opts || {})); o.macro = 'prudente'; return s3(v, o); }

  var API = { HYP: HYP, Cp: Cp, marginalP: marginalP, recettePension: recettePension, calibrerM: calibrerM, courbe: courbe, variantesPension: variantesPension, casRetraite: casRetraite,
              pensionBascule: pensionBascule, marginalCapitalRetraite: marginalCapitalRetraite, changementTva: changementTva, tva: tva, tvaCasTypes: tvaCasTypes,
              gtLignes: gtLignes, lignesFixes: lignesFixes, lignes: lignes, somme: somme, poCouche: poCouche, s3: s3, prudente: prudente };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Decisions0711 = API;
})(this);
