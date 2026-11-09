/*
 * modeles/systeme-ideal/soutenabilite.js — T47, « ce qui rendrait le palier 1 soutenable » (02/11/2026). Fonctions pures au-dessus de croissance.js, age_sante.js, demographie.js et palier1.js ;
 * trajectoires_age_depart.js (généré par generer_age_depart.py) donne retraités, emploi et actifs quand l'âge effectif de départ monte de 1 ou 2 ans. Hypothèses H183 à H190 : methode.md § 20.
 * Charger dans l'ordre : modele.js voies.js sante.js optimisation.js fiscalite_actuelle.js retraites2.js palier1.js trajectoires_demo.js demographie.js trajectoires_age.js age_sante.js croissance.js
 *   trajectoires_age_depart.js soutenabilite.js.
 *
 * Question : quelles combinaisons de leviers ramènent la dette/PIB de 2065 à son niveau de 2025 (115,7 %), intérêts compris, sans qu'elle dépasse 120,7 % entre-temps, au central
 * (démographie centrale, productivité 0,7 % du COR, taux de marché 4,0 %, reste du budget indexé sur le PIB, santé et dépendance comptées) ?
 * Leviers : socle, taux plat, indexation des pensions (prix, mixte, COR, salaires), âge effectif de départ (+1, +2 ans, module emploi), économies de dépenses (8 / 18 / 31 Md€ à 10 ans),
 * transmissions (50 % ou droits actuels), contribution des hautes pensions, création de valeur (sans levier C et sans levier E, déjà dans la productivité), productivité.
 * Le calcul s'appuie sur les modules existants (aucun chiffre recopié) : le solde de chaque année vient de age_sante.solde, les intérêts et la dette de croissance.chemin (même formule, refaite ici
 * sur des soldes additionnés ; `tests` : le palier 1 sans levier retrouve croissance.chemin à 1e-9 près). Les leviers qui ne passent pas par les modules (âge, hautes pensions, économies, valeur) sont des
 * séries de Md€ additionnées au solde. Des ordres de grandeur sous hypothèses, jamais des prédictions.
 */
(function (root) {
  'use strict';
  var C = root.Croissance || (typeof require !== 'undefined' ? require('./croissance.js') : null);
  var AS = root.AgeSante || (typeof require !== 'undefined' ? require('./age_sante.js') : null);
  var DG = root.DemographieSI || (typeof require !== 'undefined' ? require('./demographie.js') : null);
  var P1 = root.Palier1 || (typeof require !== 'undefined' ? require('./palier1.js') : null);
  var R2 = root.Retraites2 || (typeof require !== 'undefined' ? require('./retraites2.js') : null);
  var O = root.Optimisation || (typeof require !== 'undefined' ? require('./optimisation.js') : null);
  var FA = root.FiscaliteActuelle || (typeof require !== 'undefined' ? require('./fiscalite_actuelle.js') : null);
  var M = root.SystemeIdeal || (typeof require !== 'undefined' ? require('./modele.js') : null);
  var F = (root.Voies || (typeof require !== 'undefined' ? require('./voies.js') : null)).fus;
  var TD = root.TrajectoiresAgeDepart || (typeof require !== 'undefined' ? require('./trajectoires_age_depart.js') : null);
  var D = M.DONNEES, DET = C.DETTE, AN0 = DG.AN0, FIN = 2065;

  // ---------- Paramètres (H183 à H190)
  var PARAM = {
    plafond: 0.75,            // H184 : taux marginal maximal admis (Hauts § 1.2 : jusqu'à 73-75 % admis par la jurisprudence)
    tolerance: 0.05,          // H183 : la dette/PIB ne dépasse jamais celle de 2025 de plus de 5 points entre 2026 et 2065, et celle de 2065 ≤ celle de 2025
    falaiseMax: 800,          // H185 : zone à 100 % de taux marginal tolérée (revenu mensuel jusqu'où le plancher RSA de 877 € ne diminue pas), contre 580 € au palier 1 de base
    penaliteAge: 40,          // H188 ⚠️ : équivalent mensuel (€) d'un an de départ en plus pour un actif modeste (≈ 4,3 % d'une pension de 1 000 € sur une retraite de 23 ans) ; hypothèse de Claude
    monteeEco: 10,            // H187 : les économies de dépenses montent linéairement sur 10 ans (sources/recherche-economies-depenses.md : 8 / 18 / 31 Md€ à 10 ans) et restent en euros de 2025
    // H202 : option `offreTravail` : baisse (points de % des revenus d'activité D1-D9) AJOUTÉE à celle que le modèle compte déjà (palier1/modele.js : substitution 0,10, participation, effet revenu −0,15) ; négatif = hausse.
    // Proportionnelle au socle (socle / 780 €) ; appliquée aux recettes des bandes D1 à D9 (taux plat + impôt continu, avec réactions) ; sources/recherche-revenu-de-base-travail.md
    offreTravail: { aucune: 0, bas: -0.02, central: 0.01, haut: 0.03 }, socleRefOffre: 780,
    seuilPensionsMixte: 2500, // H186 : les pensions nettes sous 2 500 € suivent le COR, celles au-dessus les prix
  };
  // H190 : cas de stress pour tester la robustesse d'une combinaison stable au central : productivité 0,4 % (COR, variante basse) et taux de marché 4,5 % (dernier point Eurostat), démographie et réactions centrales
  var STRESS = { prod: 'bas', taux: 'haut', sc: 'central' };
  // Stress isolés (relecture du 01/11, D4 et D7) : un seul aléa à la fois, les autres au central. `reactions` : élasticités de comportement « bas » ou « haut » avec la démographie centrale ; `socle` : 'salaires'.
  var STRESS_ISOLES = [
    { id: 'prod', libelle: 'productivité 0,4 % (COR, variante basse)', prod: 'bas' },
    { id: 'taux', libelle: 'taux de marché 4,5 %', taux: 'haut' },
    { id: 'reactionsHautes', libelle: 'réactions de comportement hautes seules (démographie centrale)', reactions: 'haut' },
    { id: 'socleSalaires', libelle: 'socle indexé sur les salaires (au lieu des prix)', socle: 'salaires' },
    { id: 'demoHaute', libelle: 'démographie et réactions « haut » (ensemble)', sc: 'haut' },
    { id: 'cumul', libelle: 'cumul de H190 : productivité 0,4 % et taux 4,5 %', prod: 'bas', taux: 'haut' }
  ];
  var BASE = { socle: 500, tPlat: 0.35, pensions: 'prix', age: 0, economies: 0, transmissions: 'cinquante', hp: 'base', valeur: 'aucune', prod: 'central', offreTravail: 'aucune' };
  // Combinaisons de référence A1 à A3, B1, R1 (relecture du 01/11 : elles restent des repères figés, issus de la première recherche par grille de 50 € ; la recherche fine trouve d'autres combinaisons admissibles, souvent
  // au bord de la zone à 100 %, et moins coûteuses pour les ménages modestes). Elles sont testées stables après correction (test_soutenabilite.js). jeu : jeu de contraintes sous lequel elles sont admissibles.
  var REFERENCES = {
    A1: { jeu: 'pierre', c: { socle: 500, tPlat: 0.45, pensions: 'prix', age: 0, economies: 31, transmissions: 'cinquante', hp: '25-2500', valeur: 'dix' } },
    A2: { jeu: 'pierre', c: { socle: 450, tPlat: 0.45, pensions: 'prix', age: 0, economies: 18, transmissions: 'cinquante', hp: '25-2500', valeur: 'aucune' } },
    A3: { jeu: 'pierre', c: { socle: 500, tPlat: 0.48, pensions: 'prix', age: 0, economies: 8, transmissions: 'cinquante', hp: '25-2500', valeur: 'aucune' } },
    B1: { jeu: 'pierreAge', c: { socle: 450, tPlat: 0.38, pensions: 'prix', age: 2, economies: 31, transmissions: 'cinquante', hp: '30-2000', valeur: 'dix' } },
    R1: { jeu: 'pierre', c: { socle: 500, tPlat: 0.50, pensions: 'prix', age: 0, economies: 31, transmissions: 'cinquante', hp: '30-2500', valeur: 'dix' } }
  };
  // Piste « socle élevé » (§ 18.8) : points de la frontière socle / taux plat (plus grand socle stable au taux plat donné, âge et hautes pensions fixés, leviers au maximum), issus de `frontiereSocle`. Le smicard ne perd rien, le médian gagne.
  // c.age > 0 relâche « âge de départ inchangé » ; hp à seuil 2 000 € relâche « retraités sous 2 500 € non touchés » ; 30 % au-dessus de 2 500 € ne relâche rien (la contrainte porte sur les retraités sous 2 500 €).
  function refPiste(so, tp, age, hp, eco, va) { return { socle: so, tPlat: tp, pensions: 'prix', age: age, economies: eco, transmissions: 'cinquante', hp: hp, valeur: va }; }
  var PISTE_SOCLE = {
    P1: { jeu: 'socleHaut', c: refPiste(520, 0.40, 2, '30-2000', 31, 'dix') },
    P2: { jeu: 'socleHaut', c: refPiste(595, 0.44, 2, '30-2500', 31, 'dix') },
    P3: { jeu: 'socleHaut', c: refPiste(680, 0.48, 2, '25-2500', 31, 'dix') },
    P6: { jeu: 'socleHaut', c: refPiste(715, 0.50, 1, '30-2000', 31, 'dix') },
    P4: { jeu: 'socleHaut', c: refPiste(780, 0.52, 2, '30-2500', 31, 'dix') },
    P5: { jeu: 'socleHaut', c: refPiste(820, 0.54, 2, '30-2500', 31, 'dix') },
    P7: { jeu: 'socleHautStrict', c: refPiste(880, 0.57, 2, '30-2500', 31, 'dix') },
    P8: { jeu: 'socleHaut', c: refPiste(925, 0.60, 2, '30-2500', 31, 'aucune') }
  };
  var HP = { 'base': { seuil: 2500, taux: 0.20 }, '25-2500': { seuil: 2500, taux: 0.25 }, '30-2500': { seuil: 2500, taux: 0.30 }, '25-2000': { seuil: 2000, taux: 0.25 }, '30-2000': { seuil: 2000, taux: 0.30 } };
  // Grille fine (relecture du 01/11, D1) : socle par pas de 5 € (500 à 300 €), taux plat par pas de 1 point (35 à 50 %). L'ancienne grille (pas de 50 €) créait un effet de seuil (« ≥ 45 % »).
  function pas(de, a, p) { var out = [], x; for (x = de; p > 0 ? x <= a + 1e-9 : x >= a - 1e-9; x += p) out.push(Math.round(x * 1e4) / 1e4); return out; }
  var GRILLE = {
    socle: pas(500, 300, -5), tPlat: pas(0.35, 0.50, 0.01), pensions: ['prix', 'mixte', 'cor', 'salaires'], age: [0, 1, 2], economies: [0, 8, 18, 31],
    transmissions: ['cinquante', 'actuels'], hp: ['base', '25-2500', '30-2500', '25-2000', '30-2000'], valeur: ['aucune', 'dix']
  };
  // Jeux de contraintes. plafond : 'personnel' (taux marginal personnel ≤ plafond, t_max = 30 %) ou 'combine' (IS + dividende compris : t_max réduit pour que le combiné reste ≤ plafond).
  var JEUX = {
    smicSeul: { libelle: 'Plafond combiné 75 % et le smicard ne perd pas plus de 10 €/mois (aucune autre contrainte : âge, hautes pensions, indexation et transmissions libres)', plafond: 'combine', smicMin: -10 },
    juridique: { libelle: 'Plafond juridique seul (taux marginal personnel ≤ 75 %, IS non compté), t_max réduit si besoin', plafond: 'personnel' },
    combine: { libelle: 'Plafond juridique avec l\'IS (taux marginal combiné ≤ 75 %), t_max réduit si besoin, aucune autre contrainte', plafond: 'combine' },
    // Note (relecture D11) : le plafond de 75 % porte sur le taux marginal du haut de la distribution (personnel et combiné avec l'IS) ; en bas, la zone à 100 % (retrait du complément quand le revenu monte,
    // jusqu'à 685-800 € par mois) est tolérée jusqu'à 800 € (H185, choix de Claude) : les deux règles ne sont donc pas les mêmes ; le seuil de 800 € détermine le taux plat minimal (socle admissible).
    pierre: { libelle: 'Contraintes de l\'auteur : plafond combiné 75 %, minimum garanti, pensions au moins sur les prix, retraités sous 2 500 € non touchés, âge de départ inchangé, zone à 100 % ≤ 800 €', plafond: 'combine',
      ageMax: 0, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2500, falaise: true },
    pierreSmic: { libelle: 'Contraintes de l\'auteur + le smicard à 35 h ne perd pas plus de 10 €/mois par rapport à la loi actuelle (tolérance TOL_SMIC de optimisation.js, v2)', plafond: 'combine',
      ageMax: 0, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2500, falaise: true, smicMin: -10 },
    pierreDroitsActuels: { libelle: 'Contraintes de l\'auteur + transmissions aux droits actuels (D22 prudent : on ne compte pas l\'impôt de 50 %)', plafond: 'combine',
      ageMax: 0, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2500, falaise: true, transmissions: 'actuels' },
    // Piste « socle élevé » (T47, § 18.8) : on cherche la frontière socle / taux plat. Âge et seuil des hautes pensions sont libres (relâchables : la classe de relâchement est lue ensuite) ;
    // le smicard ne perd rien et le médian gagne ; plafond combiné 75 % ; zone à 100 % ≤ 800 € (H185) ou, dans la variante stricte, aucune zone à 100 % (« jamais tout prendre » : socle ≥ 877 €).
    socleHaut: { libelle: 'Socle élevé : plafond combiné 75 %, minimum garanti, zone à 100 % ≤ 800 €, smicard à 0 € ou mieux, médian gagnant ; âge et seuil des hautes pensions libres', plafond: 'combine',
      ageMax: 2, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2000, falaise: true, smicMin: 0, medianMin: 0 },
    socleHautSansSmic: { libelle: 'Socle élevé sans la contrainte du smicard (pour mesurer la perte minimale du smicard à âge inchangé) : plafond combiné 75 %, minimum garanti, zone à 100 % ≤ 800 €, médian gagnant ; âge et seuil des hautes pensions libres', plafond: 'combine',
      ageMax: 2, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2000, falaise: true, medianMin: 0 },
    socleHautStrict: { libelle: 'Socle élevé strict : comme socleHaut mais aucune zone à 100 % (le revenu net ne baisse jamais quand le revenu brut monte : socle ≥ 877 €)', plafond: 'combine',
      ageMax: 2, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2000, falaise: true, falaiseMax: 0, smicMin: 0, medianMin: 0 },
    pierreAge: { libelle: 'Contraintes de l\'auteur sauf l\'âge de départ (+1 ou +2 ans autorisés) et seuil des hautes pensions ≥ 2 000 €', plafond: 'combine',
      ageMax: 2, pensionsAutorisees: ['prix', 'mixte', 'cor', 'salaires'], hpSeuilMin: 2000, falaise: true }
  };

  function normCdf(x) {
    var t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989423 * Math.exp(-x * x / 2);
    var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }
  /** Part de la masse des pensions versée sous le seuil S (€ nets/mois), loi log-normale de la pension (médiane 1 750 €, σ = 0,5, modele.js) : Φ((ln(S/médiane) − σ²) / σ). */
  function partMasseSous(S) { var s = D.pensionSigma; return normCdf((Math.log(S / D.pensionMediane) - s * s) / s); }

  /** t_max compatible avec le plafond (H184) : 'personnel' → min(0,30 ; plafond − tPlat) ; 'combine' → min(0,30 ; 1 − (1 − plafond) / (1 − IS) − tPlat) ; arrondi vers le bas à 1e-4 près ; null sous 0,05 (impôt continu vidé de sens). */
  function tMaxPour(tPlat, mode, plafond) {
    plafond = plafond || PARAM.plafond;
    var t = mode === 'personnel' ? plafond - tPlat : 1 - (1 - plafond) / (1 - 0.25) - tPlat;
    t = Math.min(0.30, Math.floor(t * 1e4 + 1e-9) / 1e4);
    return t < 0.05 ? null : t;
  }

  function stDe(c, tMax) { return F(P1.stFor({}), { socle: c.socle, tPlat: c.tPlat, tMax: tMax }); }
  function complet(c) { var o = {}, k; for (k in BASE) o[k] = BASE[k]; for (k in (c || {})) o[k] = c[k]; return o; }

  /** Facteur d'indexation de la pension moyenne à l'année t, 2025 = 1 : 'prix' (1), 'salaires', 'cor', 'mixte' (part de la masse sous le seuil sur le COR, le reste sur les prix : H186). */
  function facteurPensions(regle, prod, annee) {
    var g = C.gEffectif(prod, annee);
    if (regle === 'mixte') { var p = partMasseSous(PARAM.seuilPensionsMixte); return p * DG.facteurPensions('cor', g, annee) + (1 - p); }
    return DG.facteurPensions(regle, g, annee);
  }

  /**
   * Un solveur pour un scénario (sc : démographie et réactions ; prod, taux) avec sa mémoire interne (les fonctions restent pures vu de l'extérieur).
   * Méthodes : evaluer(c, tMax), contraintes(c, jeu), enumerer(jeu), profils(c, tMax), effetsSeuls(), seuilProductivite(c, tMax).
   */
  function solveur(opt) {
    opt = opt || {};
    var sc = opt.sc || 'central', taux = opt.taux || 'central', grille = opt.grille || GRILLE, memo = {}, reac = opt.reactions || null, socleIdx = opt.socle || 'prix', ageEff = opt.ageEffet === undefined ? 1 : opt.ageEffet;   // ageEffet : part de l'effet net de l'âge de départ retenue (1 = module emploi tel quel ; 0,8 = assiette ajoutée surestimée de 20 %, H191)
    function mem(key, f) { return key in memo ? memo[key] : (memo[key] = f()); }
    function prodKey(p) { return typeof p === 'number' ? 'n' + p : p; }

    // --- séries (indice k = année − 2025, de 1 à 40)
    /** Solde avec santé (Md€) de chaque année pour (st, transmissions, productivité, règle prix | cor | salaires | mixte). */
    function serieBase(st, trans, prod, regle) {
      var key = ['base', st.socle, st.tPlat, st.tMax, trans, prodKey(prod), regle, socleIdx].join('|');
      return mem(key, function () {
        if (regle === 'mixte') {
          var a = serieBase(st, trans, prod, 'cor'), b = serieBase(st, trans, prod, 'prix'), p = partMasseSous(PARAM.seuilPensionsMixte), out = [], k;   // le solde est linéaire dans le facteur d'indexation (demographie.solde)
          for (k = 0; k <= FIN - AN0; k++) out.push(p * a[k] + (1 - p) * b[k]);
          return out;
        }
        var out2 = [null], t, o;
        for (t = AN0 + 1; t <= FIN; t++) {
          o = C.options(t, { prod: prod, pensions: regle, socle: socleIdx });
          if (trans === 'actuels') o.o = { transmissionsActuelles: true };
          out2.push(AS.solde(st, sc, t, o).avec);
        }
        return out2;
      });
    }
    function lignes(st, trans) {
      return mem(['L', st.socle, st.tPlat, st.tMax, trans].join('|'), function () {
        var o = C.options(AN0 + 1, { prod: 'central' });
        if (trans === 'actuels') o.o = { transmissionsActuelles: true };
        return { L: DG.lignes2025(st, sc), reste: DG.solde(st, sc, AN0 + 1, o).resteNiveau };
      });
    }
    function trajAge(age, k) { return TD.scenarios[sc]['a' + age][k]; }   // [année, retraités, emploi, actifs]
    /** Effet de l'âge de départ (+age ans) sur le solde, hors contribution des hautes pensions : mêmes formules que demographie.solde, en différences par rapport à la trajectoire du COR. */
    function serieAge(st, trans, prod, regle, age) {
      return mem(['age', st.socle, st.tPlat, st.tMax, trans, prodKey(prod), regle, age, socleIdx].join('|'), function () {
        var out = [0], l = lignes(st, trans), t, k, v, v0 = DG.volumes(sc, AN0), tr, dEmp, dAd, dRet, ip, pf;
        for (t = AN0 + 1; t <= FIN; t++) {
          k = t - AN0;
          if (!age) { out.push(0); continue; }
          v = DG.volumes(sc, t); tr = trajAge(age, k); ip = C.indiceProductivite(prod, t); pf = facteurPensions(regle, prod, t);
          dEmp = (tr[2] - v.emploi) / v0.emploi; dAd = (v.retraites - tr[1]) / v0.adultesNonRetraites; dRet = (tr[1] - v.retraites) / v0.retraites;
          out.push(l.L.assiette * dEmp * ip - l.L.socle * dAd * (socleIdx === 'salaires' ? ip : 1) + (-l.L.pensions + l.L.impotRetraites + l.L.hautesPensions) * dRet * pf + l.reste * dEmp * ip);
        }
        return out;
      });
    }
    function netHP(hp) { return mem('hp|' + hp, function () { return R2.contribution(F(P1.HP, HP[hp]), sc).netMd; }); }
    /** Variation de la contribution des hautes pensions (Md€) par rapport au palier 1 de base (20 % au-dessus de 2 500 €), pour les retraités de l'âge de départ considéré. */
    function serieHP(hp, prod, regle, age) {
      return mem(['hp', hp, prodKey(prod), regle, age].join('|'), function () {
        var out = [0], v0 = DG.volumes(sc, AN0), d = netHP(hp) - netHP('base'), t, v, ret;
        for (t = AN0 + 1; t <= FIN; t++) { v = DG.volumes(sc, t); ret = age ? trajAge(age, t - AN0)[1] : v.retraites; out.push(d * ret / v0.retraites * facteurPensions(regle, prod, t)); }
        return out;
      });
    }
    function serieEco(niveau) { var out = [0], t; for (t = AN0 + 1; t <= FIN; t++) out.push(niveau * Math.min(1, (t - AN0) / PARAM.monteeEco)); return out; }
    /** Création de valeur (H189). Relecture du 01/11 (D10) : le levier D (simplification, 15 Md€ de PIB × 0,427 = 6,4 Md€) recoupe la gestion simplifiée des économies de dépenses (H187) ; quand `economies` > 0, D est retiré. */
    function serieValeur(v, economies) {
      var out = [0], t, n, x;
      for (t = AN0 + 1; t <= FIN; t++) { n = Math.max(0, t - 2026); x = P1.valeurPourScenario(Math.min(n, 10), sc); out.push(v === 'dix' ? x.sansE - (economies > 0 ? x.D : 0) : 0); }   // H189 : gelée après la 10e année, sans levier C (H180) ni E (compté dans la productivité)
      return out;
    }
    /** Écart de réactions de comportement (Md€) : solde statique du palier 1 sous les réactions `reac` moins celui du scénario du solveur (démographie centrale), indexé sur le PIB (relecture D4). */
    function serieReactions(st, trans, prod, age) {
      return mem(['reac', st.socle, st.tPlat, st.tMax, trans, prodKey(prod), age, reac].join('|'), function () {
        var o = trans === 'actuels' ? { transmissionsActuelles: true } : undefined, d = P1.solde(st, reac, o) - P1.solde(st, sc, o), pib = seriePib(prod, age), out = [0], t;
        for (t = AN0 + 1; t <= FIN; t++) out.push(d * pib[t - AN0] / DET.pibInsee2025);
        return out;
      });
    }
    /** Part des recettes courantes (Md€, 2025, avec réactions) venant des bandes D1 à D9 : la base sur laquelle porte l'option offreTravail (H202). */
    function recettesD1D9(st) {
      return mem(['rD19', st.socle, st.tPlat, st.tMax, sc].join('|'), function () {
        var p = F(O.configR(st), { scenario: sc }), pb = M.recettesCourants(M.param(p)).parBande, s = 0, i;
        for (i = 0; i < 9; i++) s += pb[i].recetteMd;
        return s;
      });
    }
    /** Option offreTravail (H202) : réduction supplémentaire des recettes (Md€, négative) = −points × recettes D1-D9 × socle / 780, indexée sur le PIB de la série ; 'aucune' : 0. `niveau` : clé de PARAM.offreTravail ou nombre (fraction). */
    function serieOffre(st, niveau, prod, age) {
      var pts = typeof niveau === 'number' ? niveau : PARAM.offreTravail[niveau || 'aucune'], out = [0], pib, t;
      if (!pts) { for (t = AN0 + 1; t <= FIN; t++) out.push(0); return out; }
      pib = seriePib(prod, age);
      var base = -pts * recettesD1D9(st) * st.socle / PARAM.socleRefOffre;
      for (t = AN0 + 1; t <= FIN; t++) out.push(base * pib[t - AN0] / DET.pibInsee2025);
      return out;
    }
    function seriePib(prod, age) {
      return mem(['pib', prodKey(prod), age].join('|'), function () {
        var out = [DET.pibInsee2025], t, v0 = DG.volumes(sc, AN0), emp;
        for (t = AN0 + 1; t <= FIN; t++) { emp = age ? trajAge(age, t - AN0)[2] : DG.volumes(sc, t).emploi; out.push(DET.pibInsee2025 * emp / v0.emploi * C.indiceProductivite(prod, t)); }
        return out;
      });
    }

    /**
     * Trajectoire de dette d'une combinaison c (champs de BASE ; tMax en second argument, défaut 0,30) : par année 2026-2065, solde hors intérêts (avec santé), solde primaire, intérêts, solde total, dette/PIB.
     * Même formule que croissance.chemin (H172 à H174) ; résumé : r2025, r2065, rMax, stable (critère H183).
     */
    function evaluer(c, tMax) {
      c = complet(c);
      var st = stDe(c, tMax === undefined || tMax === null ? 0.30 : tMax), b = serieBase(st, c.transmissions, c.prod, c.pensions), ag = serieAge(st, c.transmissions, c.prod, c.pensions, c.age);
      var hp = serieHP(c.hp, c.prod, c.pensions, c.age), eco = serieEco(c.economies), va = serieValeur(c.valeur, c.economies), pib = seriePib(c.prod, c.age), off = serieOffre(st, c.offreTravail, c.prod, c.age), re = reac ? serieReactions(st, c.transmissions, c.prod, c.age) : null;
      var r = typeof taux === 'number' ? taux : C.TAUX[taux].r, pi = DET.inflation, dt = DET.dette2025, i = DET.tauxApparent2025, rows = [], t, k, avec, prim, I, tot, rMax = 0;
      for (t = AN0 + 1; t <= FIN; t++) {
        k = t - AN0; avec = b[k] + ageEff * ag[k] + hp[k] + eco[k] + va[k] + off[k] + (re ? re[k] : 0);
        i += (r - i) / DET.maturite; I = i * dt / (1 + pi); prim = avec + DET.interets2024 * pib[k] / DET.pibInsee2025; tot = prim - I; dt = dt / (1 + pi) - tot;
        rows.push({ annee: t, soldeHorsInterets: avec, soldePrimaire: prim, interets: I, soldeTotal: tot, dette: dt, detteSurPib: dt / pib[k], pib: pib[k] });
        if (dt / pib[k] > rMax) rMax = dt / pib[k];
      }
      var r25 = DET.detteSurPib2025, r65 = rows[rows.length - 1].detteSurPib;
      return { c: c, tMax: st.tMax, rows: rows, r2025: r25, r2065: r65, rMax: rMax, stable: r65 <= r25 + 1e-9 && rMax <= r25 + PARAM.tolerance + 1e-9,
        solde2065: rows[rows.length - 1].soldeTotal, primaire2065: rows[rows.length - 1].soldePrimaire, interets2065: rows[rows.length - 1].interets, st: st };
    }
    function ligneAn(e, annee) { return e.rows[annee - AN0 - 1]; }

    // --- contraintes
    function marginaux(st) { return mem(['marg', st.socle, st.tPlat, st.tMax].join('|'), function () { return P1.marginalMax(st); }); }
    /** Écarts aux contraintes d'un jeu (clé de JEUX) : liste des violations (vide si admissible) et indicateurs (t_max, taux marginaux, zone à 100 %). */
    function contraintes(c, jeu) {
      c = complet(c); var j = typeof jeu === 'string' ? JEUX[jeu] : jeu, k = contraintesStructure(c.socle, c.tPlat, j), v = k.violations.slice();
      if (k.tMax === null) return k;
      leviersViolations(c, j, v);
      return { ok: v.length === 0, violations: v, tMax: k.tMax, personnel: k.personnel, combine: k.combine, zone100: k.zone100 };
    }
    /** Part des contraintes qui ne dépend que du socle et du taux plat (plafond, zone à 100 %, smicard, minimum garanti) : calculée une fois par couple dans l'énumération. */
    function contraintesStructure(socle, tPlat, j) {
      return mem(['cs', socle, tPlat, j.libelle].join('|'), function () {
        var v = [], tm = tMaxPour(tPlat, j.plafond);
        if (tm === null) return { ok: false, violations: ['plafond'], tMax: null };
        var st = stDe({ socle: socle, tPlat: tPlat }, tm), m = marginaux(st), comb = m.combine, pers = m.personnel;
        if (j.plafond === 'personnel' ? pers > PARAM.plafond + 1e-9 : comb > PARAM.plafond + 1e-9) v.push('plafond');
        if (j.falaise && m.finPlancherRSA > (j.falaiseMax !== undefined ? j.falaiseMax : PARAM.falaiseMax) + 1e-9) v.push('zone à 100 %');
        if (j.smicMin !== undefined && profilsActifs(st).smic35.ecartMois < j.smicMin - 1e-9) v.push('smicard');
        if (j.medianMin !== undefined && profilsActifs(st).median.ecartMois < j.medianMin - 1e-9) v.push('médian');
        if (!st.complRsa) v.push('minimum garanti');
        return { ok: v.length === 0, violations: v, tMax: tm, personnel: pers, combine: comb, zone100: m.finPlancherRSA };
      });
    }
    function leviersViolations(c, j, v) {
      if (j.ageMax !== undefined && c.age > j.ageMax) v.push('âge');
      if (j.pensionsAutorisees && j.pensionsAutorisees.indexOf(c.pensions) < 0) v.push('pensions');
      if (j.hpSeuilMin !== undefined && HP[c.hp].seuil < j.hpSeuilMin) v.push('hautes pensions');
      if (j.transmissions && c.transmissions !== j.transmissions) v.push('transmissions');
    }

    // --- profils (cas types en 2025, central) : écart au palier 1 de base et à la loi actuelle
    var SRC = {
      smic35: function () { return M.CAS.filter(function (x) { return x.id === 'smic35'; })[0]; },
      median: function () { return { id: 'median', libelle: 'Salarié médian (2 116 € nets)', adultes: 1, enfants: 0, age: 40, heuresSemaine: 35, coutMensuelPlein: 3676.54, actuel: 2115.89 }; },
      cadre4k: function () { var x = M.CAS.filter(function (y) { return y.id === 'cadre60'; })[0]; return F(x, { actuel: FA.netApresIR(3900), libelle: 'Cadre à 60 k€ brut (≈ 4 000 € nets)' }); },
      cadre8k: function () { return { id: 'cadre8k', libelle: 'Cadre à 8 000 € nets', adultes: 1, enfants: 0, age: 45, heuresSemaine: 35, coutMensuelPlein: FA.coutEmployeurDepuisNet(8000), actuel: FA.netApresIR(8000) }; }
    };
    function profilsActifs(st) {
      return mem(['pa', st.socle, st.tPlat, st.tMax].join('|'), function () {
        var p = F(O.configR(st), { scenario: sc }), out = {};
        Object.keys(SRC).forEach(function (id) { var s = SRC[id](), x = M.situation(s, p); out[id] = { id: id, libelle: s.libelle, avantMois: s.actuel, apresMois: x.apresMois, ecartMois: x.apresMois - s.actuel }; });
        return out;
      });
    }
    function retraite(pn, hp) {
      return mem('ret|' + pn + '|' + hp, function () { var r = R2.casRetraite(pn, 0, F(P1.HP, HP[hp]), 'Retraité à ' + pn + ' € nets'); return { id: 'ret' + pn, libelle: r.libelle, avantMois: r.avantMois, apresMois: r.apresMois, ecartMois: r.ecartMois }; });
    }
    /** Écart (€/mois, 2025, central) de chaque profil : palier 1 de base (35 %, 500 €, 20 % au-dessus de 2 500 €) et combinaison c ; pour le retraité à 1 200 € s'ajoute l'effet de l'indexation en 2045 par rapport aux prix. */
    function profils(c, tMax) {
      c = complet(c);
      var st = stDe(c, tMax === undefined || tMax === null ? 0.30 : tMax), ref = profilsActifs(stDe(BASE, 0.30)), cur = profilsActifs(st), out = [];
      ['smic35', 'median', 'cadre4k', 'cadre8k'].forEach(function (id) {
        out.push({ id: id, libelle: cur[id].libelle, avantMois: cur[id].avantMois, ecartRef: ref[id].ecartMois, ecart: cur[id].ecartMois, deltaRef: cur[id].ecartMois - ref[id].ecartMois });
      });
      [1200, 3500].forEach(function (pn) {
        var r = retraite(pn, c.hp), r0 = retraite(pn, 'base'), dInd = pn * (facteurPensions(c.pensions, c.prod, 2045) - 1);
        out.push({ id: 'ret' + pn, libelle: r.libelle, avantMois: r.avantMois, ecartRef: r0.ecartMois, ecart: r.ecartMois, deltaRef: r.ecartMois - r0.ecartMois, indexation2045: dInd });
      });
      return out;
    }
    /** Coût pour les ménages modestes (€/mois, 2025) : somme des pertes (jamais compensées par un gain) du Smic à 35 h et du salarié médian par rapport au palier 1 de base, du retraité à 1 200 €
     * (indexation en 2045 moins bien qu'aux prix : jamais ici, les prix étant la référence) et pénalité d'âge (H188) pour chaque année de départ en plus. */
    function coutModestes(c, tMax) {
      var p = profils(c, tMax), cm = 0;
      p.forEach(function (x) { if (x.id === 'smic35' || x.id === 'median') cm += Math.max(0, -x.deltaRef); if (x.id === 'ret1200') cm += Math.max(0, -x.deltaRef) + Math.max(0, -x.indexation2045); });
      return { monetaire: cm, age: PARAM.penaliteAge * 2 * complet(c).age, total: cm + PARAM.penaliteAge * 2 * complet(c).age };
    }
    /** Hypothèses favorables mobilisées (plus c'est haut, plus la combinaison est fragile) : transmissions à 50 % (1), économies 8 / 18 / 31 Md€ (0,25 / 0,5 / 1), création de valeur (0,5), âge (0,5 par an), hautes pensions à 30 % (0,25). */
    function fragilite(c) {
      c = complet(c);
      return (c.transmissions === 'cinquante' ? 1 : 0) + (c.economies >= 31 ? 1 : c.economies >= 18 ? 0.5 : c.economies >= 8 ? 0.25 : 0) + (c.valeur === 'dix' ? 0.5 : 0) + 0.5 * c.age + (c.hp.indexOf('30') === 0 ? 0.25 : 0);
    }

    /** Toutes les combinaisons de la grille admissibles pour le jeu, évaluées ; { total, admissibles, stables, liste (stables, triées par coût modeste puis fragilité puis taux plat), parmi3 }. */
    function enumerer(jeu, stress) {
      stress = stress || STRESS;
      var j = typeof jeu === 'string' ? JEUX[jeu] : jeu, g = grille, total = 0, adm = 0, stables = [], sv2 = solveur({ sc: stress.sc, taux: stress.taux, grille: grille });
      g.socle.forEach(function (so) { g.tPlat.forEach(function (tp) {
        var ks = contraintesStructure(so, tp, j), nlev = g.pensions.length * g.age.length * g.economies.length * g.transmissions.length * g.hp.length * g.valeur.length;
        if (!ks.ok) { total += nlev; return; }
        g.pensions.forEach(function (pe) { g.age.forEach(function (ag) { g.economies.forEach(function (ec) { g.transmissions.forEach(function (tr) { g.hp.forEach(function (h) { g.valeur.forEach(function (va) {
          total++;
          var c = { socle: so, tPlat: tp, pensions: pe, age: ag, economies: ec, transmissions: tr, hp: h, valeur: va, prod: 'central' }, k = ks;
          if (!k.ok || k.tMax === null) return;
          var vl = []; leviersViolations(c, j, vl); if (vl.length) return;
          adm++;
          var e = evaluer(c, k.tMax);
          if (e.stable) stables.push({ c: c, tMax: k.tMax, r2065: e.r2065, rMax: e.rMax, solde2065: e.solde2065, zone100: k.zone100, fragilite: fragilite(c) });
        }); }); }); }); }); });
      }); });
      stables.forEach(function (s) {
        var cm = coutModestes(s.c, s.tMax), e2 = sv2.evaluer(F(s.c, { prod: stress.prod }), s.tMax);
        s.cout = cm.total; s.coutMonetaire = cm.monetaire; s.stableStress = e2.stable; s.r2065Stress = e2.r2065;
      });
      stables.sort(function (a, b) { return (a.cout - b.cout) || (a.fragilite - b.fragilite) || (a.c.tPlat - b.c.tPlat) || (b.c.socle - a.c.socle) || (a.r2065 - b.r2065); });
      // trois moins coûteuses, distinctes par (socle, taux plat, âge)
      var vus = {}, parmi3 = [];
      stables.forEach(function (s) { var key = [s.c.socle, s.c.tPlat, s.c.age].join('|'); if (!vus[key] && parmi3.length < 3) { vus[key] = true; parmi3.push(s); } });
      var robustes = stables.filter(function (s) { return s.stableStress; }), vus2 = {}, parmi3Robustes = [];
      robustes.forEach(function (s) { var key = [s.c.socle, s.c.tPlat, s.c.age].join('|'); if (!vus2[key] && parmi3Robustes.length < 3) { vus2[key] = true; parmi3Robustes.push(s); } });
      return { jeu: j, total: total, admissibles: adm, stables: stables.length, robustes: robustes.length, liste: stables, parmi3: parmi3, parmi3Robustes: parmi3Robustes, stress: stress };
    }

    /**
     * Seuil de taux plat sous un jeu de contraintes, hors grille (relecture du 01/11, D1 et D6) : les autres leviers (pensions, âge, économies, transmissions, hautes pensions, valeur, productivité) sont fixés par `leviers` ;
     * pour chaque taux plat de 35 % à `max` (pas de 0,25 point) on prend le PLUS PETIT socle admissible (pas de 5 € de 300 à 500 €, affiné à moins de 0,01 € : c'est la zone à 100 % ≤ 800 € qui le borne en général),
     * puis on teste la stabilité ; le seuil est le premier taux plat stable, affiné par dichotomie sur 0,25 point. Le solde n'étant pas monotone au-delà de 55-60 % (réactions de l'offre de travail),
     * le seuil est le plus petit taux plat trouvé par ce balayage. Retourne null si aucun taux plat jusqu'à `max` ne suffit.
     */
    function seuilPlat(jeu, leviers, max) {
      var j = typeof jeu === 'string' ? JEUX[jeu] : jeu, lv = leviers || {};
      max = max || 0.65;
      function cle(socle, tp) { var q = {}, k; for (k in lv) q[k] = lv[k]; q.socle = socle; q.tPlat = tp; return q; }
      function admis(socle, tp) { return contraintes(cle(socle, tp), j).ok; }
      function meilleurSocle(tp) {
        var x, hi = null, lo;
        for (x = 300; x <= 500 + 1e-9; x += 5) if (admis(x, tp)) { hi = x; break; }
        if (hi === null) return null;
        if (hi === 300) return 300;
        lo = hi - 5;
        for (var i = 0; i < 20; i++) { var mid = (lo + hi) / 2; if (admis(mid, tp)) hi = mid; else lo = mid; }
        return Math.ceil(hi * 100) / 100;
      }
      function essai(tp) {
        var so = meilleurSocle(tp); if (so === null) return null;
        var q = cle(so, tp), k = contraintes(q, j), e = evaluer(complet(q), k.tMax);
        return { tPlat: tp, socle: so, tMax: k.tMax, r2065: e.r2065, rMax: e.rMax, stable: e.stable, zone100: k.zone100 };
      }
      var prev = 0.35 - 0.0025, tp, r, a, b, i, m;
      for (tp = 0.35; tp <= max + 1e-9; tp += 0.0025) {
        r = essai(tp);
        if (r && r.stable) {
          if (prev < 0.35) return r;
          a = prev; b = tp;
          for (i = 0; i < 16; i++) { m = (a + b) / 2; var rm = essai(m); if (rm && rm.stable) { b = m; r = rm; } else a = m; }
          return r;
        }
        prev = tp;
      }
      return null;
    }
    /**
     * Frontière socle / taux plat (§ 18.8) : pour chaque taux plat (pas de 0,5 point de 35 % à `opt.platMax`, défaut 60 %) et chaque combinaison de leviers de la grille (pensions sur les prix, transmissions à 50 %, âge, économies,
     * hautes pensions, création de valeur ; `opt.age`, `opt.economies`, `opt.hp`, `opt.valeur`, `opt.transmissions`, `opt.prod` restreignent la grille), le PLUS GRAND socle (pas de 5 €, de 300 à `opt.socleMax`, défaut 1 000 €) admissible pour le jeu ET stable au central. La stabilité est monotone en le socle (un socle plus haut coûte plus) :
     * recherche par dichotomie sur la liste des socles admissibles (vérifiée par balayage complet dans les tests). Retourne la liste des { plat, c, socle, tMax, r2065, rMax, zone100, relache : { age, hp } } ; `classe` : '0' (aucune contrainte de l'auteur relâchée),
     * 'A' (âge), 'H' (seuil des hautes pensions < 2 500 €), 'AH' (les deux).
     */
    function frontiereSocle(jeu, opt) {
      opt = opt || {};
      var j = typeof jeu === 'string' ? JEUX[jeu] : jeu, g = grille, platMax = opt.platMax || 0.60, socleMax = opt.socleMax || 1000, out = [], socles = pas(300, socleMax, 5), plats = pas(0.35, platMax, 0.005);
      var trans = opt.transmissions || ['cinquante'], pens = opt.pensions || ['prix'], ages = opt.age || g.age, ecos = opt.economies || g.economies, hps = opt.hp || g.hp, vals = opt.valeur || g.valeur;
      plats.forEach(function (tp) {
        var adm = socles.filter(function (so) { return contraintesStructure(so, tp, j).ok; });
        if (!adm.length) return;
        pens.forEach(function (pe) { ages.forEach(function (ag) { ecos.forEach(function (ec) { trans.forEach(function (tr) { hps.forEach(function (h) { vals.forEach(function (va) {
          var c = { socle: 0, tPlat: tp, pensions: pe, age: ag, economies: ec, transmissions: tr, hp: h, valeur: va, prod: opt.prod || 'central', offreTravail: opt.offreTravail || 'aucune' }, vl = [], lo, hi, mid, q;
          leviersViolations(c, j, vl); if (vl.length) return;
          function ev(i) { q = F(c, { socle: adm[i] }); return evaluer(q, contraintesStructure(adm[i], tp, j).tMax); }
          if (!ev(0).stable) return;
          lo = 0; hi = adm.length - 1;
          if (ev(hi).stable) lo = hi; else while (hi - lo > 1) { mid = (lo + hi) >> 1; if (ev(mid).stable) lo = mid; else hi = mid; }
          var e = ev(lo), ks = contraintesStructure(adm[lo], tp, j), age = ag > 0, hpR = HP[h].seuil < 2500;
          out.push({ plat: tp, c: F(c, { socle: adm[lo] }), socle: adm[lo], tMax: ks.tMax, r2065: e.r2065, rMax: e.rMax, zone100: ks.zone100, classe: (age ? 'A' : '') + (hpR ? 'H' : '') || '0', relache: { age: age, hp: hpR } });
        }); }); }); }); }); });
      });
      return out;
    }
    /** Plus petit socle (pas de 5 €, de 300 à `socleMax`, défaut 1 000 €) admissible pour le jeu au taux plat `tp` (smicard, médian, zone à 100 %, plafond), ou null. */
    function socleMinAdmissible(jeu, tp, socleMax) {
      var j = typeof jeu === 'string' ? JEUX[jeu] : jeu, x;
      for (x = 300; x <= (socleMax || 1000) + 1e-9; x += 5) if (contraintesStructure(x, tp, j).ok) return x;
      return null;
    }
    /** Retraités (€/mois, 2025, central) pour une combinaison : écart à la loi actuelle pour des pensions nettes de 1 200, 2 000, 2 500, 3 000 et 3 500 €, et manque de l'indexation sur les prix par rapport à la pension relative du COR en 2045 (€/mois, pension de 2025). */
    function retraites(c) {
      c = complet(c);
      var cor = DG.facteurPensions('cor', C.gEffectif('central', 2045), 2045), px = facteurPensions(c.pensions, c.prod, 2045);
      return [1200, 2000, 2500, 3000, 3500].map(function (pn) { var r = retraite(pn, c.hp), r0 = retraite(pn, 'base'); return { pn: pn, avantMois: r.avantMois, ecart: r.ecartMois, ecartRef: r0.ecartMois, manqueCor2045: pn * (px - cor) }; });
    }
    /** Dette/PIB de 2065 et maximum d'une combinaison sous chaque stress isolé (STRESS_ISOLES), les autres hypothèses restant celles du solveur courant. */
    function stressIsoles(c, tMax) {
      c = complet(c);
      return STRESS_ISOLES.map(function (z) {
        var o = { sc: z.sc || sc, taux: z.taux || taux, reactions: z.reactions || reac, socle: z.socle || socleIdx, grille: grille }, q = {}, k, e;
        for (k in c) q[k] = c[k];
        if (z.prod) q.prod = z.prod;
        e = solveur(o).evaluer(q, tMax);
        return { id: z.id, libelle: z.libelle, r2065: e.r2065, rMax: e.rMax, stable: e.stable };
      });
    }

    /** Effet de chaque levier pris seul à partir du palier 1 de base : écart de solde avec intérêts en 2035 / 2045 / 2065 (Md€) et dette/PIB 2065 (plafond juridique : t_max ajusté, jeu 'combine'). */
    function effetsSeuls() {
      var ref = evaluer(BASE, 0.30), out = [];
      function ligne(nom, c, jeu) {
        var k = contraintes(c, jeu || 'combine'), tm = k.tMax === null ? 0.30 : k.tMax, e = evaluer(c, tm);
        out.push({ nom: nom, c: complet(c), admissible: k.ok, violations: k.violations, tMax: tm, ecart: [2035, 2045, 2065].map(function (a) { return ligneAn(e, a).soldeTotal - ligneAn(ref, a).soldeTotal; }),
          ecartHorsInterets: [2035, 2045, 2065].map(function (a) { return ligneAn(e, a).soldeHorsInterets - ligneAn(ref, a).soldeHorsInterets; }), r2065: e.r2065, rMax: e.rMax, stable: e.stable });
      }
      ligne('Palier 1 tel quel (35 %, 500 €, pensions sur les prix)', BASE, 'juridique');
      [450, 400, 350, 300].forEach(function (s) { ligne('Socle ' + s + ' €', { socle: s }, 'juridique'); });
      [0.36, 0.38, 0.40, 0.42, 0.45].forEach(function (t) { ligne('Taux plat ' + Math.round(t * 100) + ' %', { tPlat: t }, 'juridique'); });
      [0.38, 0.40].forEach(function (t) { ligne('Taux plat ' + Math.round(t * 100) + ' % avec plafond combiné 75 % (t_max réduit)', { tPlat: t }, 'combine'); });
      ['mixte', 'cor', 'salaires'].forEach(function (p) { ligne('Pensions sur ' + (p === 'mixte' ? 'le COR sous 2 500 €, les prix au-dessus' : p === 'cor' ? 'la pension relative du COR' : 'les salaires'), { pensions: p }, 'juridique'); });
      [1, 2].forEach(function (a) { ligne('Âge effectif de départ +' + a + ' an' + (a > 1 ? 's' : '') + ' (rampe 2027-2040)', { age: a }, 'juridique'); });
      [8, 18, 31].forEach(function (e) { ligne('Économies de dépenses ' + e + ' Md€ à 10 ans', { economies: e }, 'juridique'); });
      ligne('Transmissions aux droits actuels (pas de 50 %)', { transmissions: 'actuels' }, 'juridique');
      ['25-2500', '30-2500', '30-2000'].forEach(function (h) { ligne('Hautes pensions : ' + HP[h].taux * 100 + ' % au-dessus de ' + HP[h].seuil + ' €', { hp: h }, 'juridique'); });
      ligne('Création de valeur (sans C ni E), gelée après 10 ans', { valeur: 'dix' }, 'juridique');
      [0.010, 0.014].forEach(function (g) { ligne('Productivité ' + (g * 100).toFixed(1).replace('.', ',') + ' % par an au lieu de 0,7 %', { prod: g }, 'juridique'); });
      return { ref: ref, lignes: out };
    }

    /** Plus petite productivité (fraction par an, constante) pour laquelle la combinaison c est stable, par dichotomie entre 0 et 6 % ; null si 6 % ne suffit pas. */
    function seuilProductivite(c, tMax) {
      c = complet(c);
      var lo = 0, hi = 0.06, i, x, cc = function (g) { var q = {}, k; for (k in c) q[k] = c[k]; q.prod = g; return evaluer(q, tMax); };
      if (!cc(hi).stable) return null;
      if (cc(lo).stable) return 0;
      for (i = 0; i < 30; i++) { x = (lo + hi) / 2; if (cc(x).stable) hi = x; else lo = x; }
      return hi;
    }
    /** Valeur minimale d'un levier continu seul (socle, taux plat ou économies ; aucun plafond ; hors grille) qui rend le palier 1 stable ; null si impossible dans l'intervalle. */
    function seuilLevier(nom, base) {
      base = complet(base);
      var f = function (x) { var q = {}, k; for (k in base) q[k] = base[k]; q[nom] = x; return evaluer(q, 0.30); };
      var lo, hi, i, x;
      if (nom === 'socle') { lo = 0; hi = base.socle; if (!f(lo).stable) return null; for (i = 0; i < 40; i++) { x = (lo + hi) / 2; if (f(x).stable) lo = x; else hi = x; } return lo; }
      if (nom === 'tPlat') {   // balayage par 0,5 point (le solde n'est pas monotone au-delà de 55-60 % : réactions de l'offre de travail), puis dichotomie
        lo = base.tPlat; hi = null;
        for (x = base.tPlat + 0.005; x <= 0.70 + 1e-9; x += 0.005) { if (f(x).stable) { hi = x; break; } lo = x; }
        if (hi === null) return null;
        for (i = 0; i < 40; i++) { x = (lo + hi) / 2; if (f(x).stable) hi = x; else lo = x; }
        return hi;
      }
      if (nom === 'economies') { lo = 0; hi = 400; if (!f(hi).stable) return null; for (i = 0; i < 40; i++) { x = (lo + hi) / 2; if (f(x).stable) hi = x; else lo = x; } return hi; }
      throw new Error('levier continu inconnu : ' + nom);
    }
    return { evaluer: evaluer, frontiereSocle: frontiereSocle, socleMinAdmissible: socleMinAdmissible, retraites: retraites, seuilPlat: seuilPlat, stressIsoles: stressIsoles, contraintes: contraintes, enumerer: enumerer, profils: profils, coutModestes: coutModestes, fragilite: fragilite, effetsSeuls: effetsSeuls, seuilProductivite: seuilProductivite, seuilLevier: seuilLevier, ligneAn: ligneAn, sc: sc };
  }

  var API = { REFERENCES: REFERENCES, PISTE_SOCLE: PISTE_SOCLE, STRESS: STRESS, STRESS_ISOLES: STRESS_ISOLES, PARAM: PARAM, BASE: BASE, HP: HP, GRILLE: GRILLE, JEUX: JEUX, partMasseSous: partMasseSous, tMaxPour: tMaxPour, facteurPensions: facteurPensions, complet: complet, solveur: solveur };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Soutenabilite = API;
})(this);
