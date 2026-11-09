/*
 * modeles/systeme-ideal/optimum_options_0411.js — « Options du 04/11 » (04/11/2026) : effet sur l'équilibre de la v5 des recommandations de la nuit du 03 au 04/11 en attente de décision de l'auteur.
 * Module SÉPARÉ au-dessus d'optimum.js : AUCUN défaut d'optimum.js n'est modifié, la v5 par défaut est identique. Fonctions pures, euros de 2025, Md€/an en croisière.
 * Hypothèses H700 à H712 (methode.md § 35). Points à vérifier V12200 à V12229.
 *
 * Charger (depuis modeles/systeme-ideal/) : la liste d'optimum.js (modele.js … ../capital-de-depart/continu.js optimum.js), puis optimum_options_0411.js (puis ../risques/stress.js pour la dette).
 *
 * Cinq options, chacune désactivée par défaut (un objet d'options vide ne change rien) :
 *   cmg            le complément de libre choix du mode de garde (7,3 Md€, CSS L531-5 et L531-6) reste un remboursement de service, hors des prestations remplacées par l'allocation unique (V11773)
 *   tvaTravaux     le taux de 10 % de TVA sur les travaux d'amélioration et d'entretien est conservé (sorti du périmètre de la mesure 23) : coût 1,7 / 1,0 / 0,5 Md€ (V12051)
 *   majDegressive  la majoration de 400 € par enfant des parents isolés est remplacée par une majoration par enfant, ouverte à tous, dégressive avec le niveau de vie du foyer :
 *                  plateau jusqu'au niveau de vie du parent isolé au Smic (contrainte : il garde +138 €/mois), puis baisse linéaire à pente fixée (part de la perte de majoration reprise par euro de revenu du foyer) ;
 *                  { M: 400, pente: 0,25 } par défaut ; { nv1: x } fixe la fin de la dégressivité (€ par UC et par an)
 *   plafonds       { mode: 'annuel75' | 'continu', transmission: bool } : 'annuel75' = taxe de 1 % + prélèvement ≤ 75 % du revenu de l'année, au-dessus de la médiane aussi ; 'continu' = plafond continu
 *                  (part du revenu plafonnée : 5 % jusqu'à la médiane, puis montée linéaire jusqu'à 75 % − taux plat à deux fois la médiane, constante ensuite ; il remplace le saut du seuil de la médiane) ; transmission: true = créance + gain + droits ≤ 50 % de la valeur à la vente ou au décès
 *                  (cumul_patrimoine.js, § 6 de la note)
 *   chomage        vérification seulement (chomageV5) : la v5 contient déjà l'assurance chômage absorbée avec le complément dégressif deg2 (12,6 Md€ au central) : aucun coût supplémentaire
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var Z = root.Optimum || (req ? req('./optimum.js') : null);
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var O = root.Optimisation || (req ? req('./optimisation.js') : null);
  var OF = root.OptionsFinancement || (req ? req('./options_financement.js') : null);
  var TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var G = root.GagnantsPerdants || (req ? req('../gagnants-perdants/modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var F = (root.Voies || (req ? req('./voies.js') : null)).fus;
  var SCS = ['bas', 'central', 'haut'];

  // ---------- Paramètres et hypothèses (H700-H712)
  var HYP = {
    cmg: [7.3, 7.3, 7.3],                // H700 ⚠️ V11773 : CMG (assistant maternel, garde à domicile, crèche), 7,3 Md€ ; un seul chiffre sourcé (revue-ia-prestations-familiales.md § 6) : pas de fourchette
    tvaTravaux: [1.7, 1.0, 0.5],         // H701 ⚠️ V12051 : 2 465 M€ de dépense fiscale 2026 (V11830) au prorata de 12,2 Md€ brut ; ordre du modèle (favorable, central, défavorable) comme NICHES_TVA 8,5 / 4,7 / 2,4
    depenseFiscaleTravaux: 2.465, bruteNiches: 12.2,
    uc: { adulteSup: 0.5, enfant: 0.3 }, // H702 ⚠️ : échelle de l'Insee (1 ; 0,5 ; 0,3 pour un enfant de moins de 14 ans) ; les âges des enfants des cas types ne sont pas précisés
    inclinaison: [-0.3, 0, 0.3],         // H703 ⚠️ : enfants par vingtième de niveau de vie proportionnels aux UC (convention de gagnants-perdants/palier1.js) au central ; bas (favorable) = −30 % en bas ; haut = +30 % en bas
    pente: 0.25,                         // H704 : part de la perte de majoration reprise par euro de revenu du foyer (même valeur que le retrait du complément du socle)
    partGardeNc: [0.25, 0.5, 1.0],       // H705 ⚠️ : part de la taxe sur les titres non cotés recouvrée au DÉCÈS (donc dans le champ du plafond de 50 %) et non à la vente (droits nuls : le plafond n'y joue pas)
    partAbandon: 0.45,                   // H706 ⚠️ : part de la créance abandonnée par la règle (b) dans les successions où elle joue : 8,6 / 19,4 = 44 % (entreprise), 4,6 / 9,4 = 49 % (50 M€) : cumul_patrimoine.js § 6
    rampe: 1,                            // H707 ⚠️ : le plafond continu monte de 5 % du revenu à la médiane à (75 % − taux plat) du revenu à deux fois la médiane (rampe = 1 médiane)
    dureeFlux: 12                        // H537 : années moyennes de la créance : le report d'encaissement se prolonge d'autant dans le chemin de dette
  };
  var CAS_ISOLE = 'parent_isole_smic', GAIN_ISOLE = 138;   // contrainte de la décision du 03/11 : +138 €/mois pour le parent isolé au Smic (2 enfants), central

  function exil(a, fn) { return Z.avecExil(Z.archi(a).exil, fn); }

  // ---------- Options 1 et 2 : montants fixes
  function coutCmg(sc) { return HYP.cmg[SCS.indexOf(sc)]; }
  function coutTvaTravaux(sc) { return HYP.tvaTravaux[SCS.indexOf(sc)]; }

  // ---------- Option 3 : majoration par enfant dégressive
  /** Unités de consommation d'un cas type (adultes, enfants de moins de 14 ans). */
  function ucCas(s) { return 1 + HYP.uc.adulteSup * (s.adultes - 1) + HYP.uc.enfant * s.enfants; }
  function defCas(id) { var d = GP.CAS_TYPES.filter(function (x) { return x.id === id; })[0]; return typeof d.s === 'function' ? d.s() : d.s; }
  /** Niveau de vie (€ par UC et par an) d'un cas type après la v5 : (revenu actuel + écart) × 12 / UC, avec la majoration actuelle pour les parents isolés. */
  function niveauVie(a, id, ct) { ct = ct || Z.casTypes(a); return (ct[id].avantMois + ct[id].ecartMois) * 12 / ucCas(defCas(id)); }
  /** Enfants (millions) par vingtième de niveau de vie, scénario d'indice i : proportionnels aux UC (palier1.js), inclinés de HYP.inclinaison[i], total conservé. */
  function enfantsVingtiemes(i) {
    var V = G.VINGTIEMES, w = [], s = 0, v, tilt = HYP.inclinaison[i];
    for (v = 0; v < 20; v++) { var uc = V.rdbMd[v] * 1e9 / V.rdbParUC[v]; w.push(uc * (1 + tilt * (9.5 - v) / 9.5)); s += w[v]; }
    return w.map(function (x) { return G.POP.enfants * x / s / 1e6; });
  }
  /** Paramètres de la majoration dégressive : M par enfant et par mois, plateau jusqu'à nv0 (niveau de vie du parent isolé au Smic), fin nv1 (pente → nv1 pour le parent isolé de 2 enfants). */
  function paramsMaj(a, o) {
    o = o || {}; a = Z.archi(a);
    var Mx = o.M || a.majParentIsole, nv0 = o.nv0 || niveauVie(a, CAS_ISOLE), pente = o.pente || HYP.pente, s = defCas(CAS_ISOLE);
    var nv1 = o.nv1 !== undefined ? o.nv1 : nv0 + 2 * Mx * 12 / (pente * ucCas(s));   // 2 enfants × M × 12 € de perte, répartis sur (nv1 − nv0) × UC de revenu du foyer
    return { M: Mx, nv0: nv0, nv1: nv1, pente: pente };
  }
  /** Majoration par enfant (€/mois) au niveau de vie nv (€/UC/an). */
  function majEnfant(p, nv) { if (nv <= p.nv0) return p.M; if (nv >= p.nv1) return 0; return p.M * (p.nv1 - nv) / (p.nv1 - p.nv0); }
  /** Coût de la majoration dégressive pour tous les enfants (Md€/an), scénario d'indice i. */
  function coutMajDeg(p, i) {
    var e = enfantsVingtiemes(i), V = G.VINGTIEMES, s = 0, v;
    for (v = 0; v < 20; v++) s += e[v] * 1e6 * majEnfant(p, V.rdbParUC[v]) * 12 / 1e9;
    return s;
  }
  /** Coût de la majoration actuelle (parents isolés), Md€/an, scénario sc : celle d'optimum.js (coutCorrectifs.b). */
  function coutMajActuelle(a, sc) { return Z.coutCorrectifs(sc, Z.archi(a)).b; }
  /** Surcoût net de l'option 3 : majoration dégressive − majoration actuelle (Md€/an). */
  function surcoutMajDeg(a, sc, o) { var p = paramsMaj(a, o); return coutMajDeg(p, SCS.indexOf(sc)) - coutMajActuelle(a, sc); }
  /** Cas types après l'option 3 (€/mois) : écart de la v5 − majoration actuelle des parents isolés + majoration dégressive au niveau de vie du cas. */
  function casTypesMajDeg(a, o) {
    a = Z.archi(a); var p = paramsMaj(a, o), ct = Z.casTypes(a), out = {};
    Object.keys(ct).forEach(function (id) {
      var s = defCas(id), e = ct[id].ecartMois;
      if (s && s.enfants > 0) {
        var nv = niveauVie(a, id, ct);
        if (s.adultes === 1) e -= a.majParentIsole * s.enfants;
        e += s.enfants * majEnfant(p, nv);
      }
      out[id] = { id: id, avantMois: ct[id].avantMois, ecartMois: e, ecartAvant: ct[id].ecartMois };
    });
    return out;
  }
  /** Écart par dixième de niveau de vie (€/UC/mois, central) après l'option 3 : écart de la v5 + majoration dégressive (vingtièmes regroupés par deux) − majoration actuelle (clé « prestations familiales »). */
  function decilesMajDeg(a, o) {
    a = Z.archi(a); var p = paramsMaj(a, o), d0 = Z.deciles(a), e = enfantsVingtiemes(1), V = G.VINGTIEMES, uc = G.ucParDecile(), k = Z.clePF();
    var cb = Z.coutCorrectifs('central', a).b * 1e9;
    return d0.map(function (x, d) {
      var n = 0, v; for (v = 2 * d; v <= 2 * d + 1; v++) n += e[v] * 1e6 * majEnfant(p, V.rdbParUC[v]) * 12;
      var nouveau = n / (uc[d] * 1e6 * 12), ancien = cb * k[d];
      return { decile: x.decile, avant: x.ecart, apres: x.ecart + nouveau - ancien, majNouvelle: nouveau, majActuelle: ancien };
    });
  }
  /** Taux marginal ajouté par la dégressivité pour un foyer de `enfants` enfants et `uc` unités de consommation, dans la zone de baisse (part de revenu du foyer). */
  function pentePourCas(p, enfants, uc) { return enfants * p.M * 12 / ((p.nv1 - p.nv0) * uc); }

  /**
   * Taux marginal effectif maximal d'un ménage type ('parent' : parent isolé, 2 enfants ; 'couple' : couple monoactif, 2 enfants) quand la majoration dégressive s'ajoute à la courbe de la v5 (optimum.js courbeTME) :
   * dans la zone de dégressivité (niveau de vie entre nv0 et nv1), la perte de majoration (pente) s'ajoute au taux marginal. Approximation : la courbe de la v5 est celle du ménage AVEC la majoration actuelle (H708 ⚠️).
   */
  function tmeMajDeg(a, type, o) {
    a = Z.archi(a); var p = paramsMaj(a, o), xs = [], x, cv, m = { tme: 0, x: 0, nv: 0, v5: Z.tmeMax(a, type) };
    for (x = 0.25; x <= 6.001; x += 0.25) xs.push(x);
    var uc = X_UC[type];
    cv = Z.courbeTME(a, type, xs);
    cv.forEach(function (k) {
      var nv = k.revenu * 12 / uc, t = k.tme + ((nv > p.nv0 && nv < p.nv1) ? pentePourCas(p, 2, uc) : 0);
      if (t > m.tme) { m.tme = t; m.x = k.x; m.nv = nv; }
    });
    return m;
  }
  var X_UC = { parent: 1.6, couple: 2.1 };   // H702 : UC du parent isolé et du couple avec 2 enfants de moins de 14 ans

  // ---------- Option 4 : plafonds
  /**
   * Part de la taxe différée (paiement reporté en créance) pour une règle de plafonnement : même calcul que optimum.js (distributionTaxe, H536) avec une fonction cap(R, revenu par UC) → plafond annuel de
   * la taxe (€ par ménage). Contrôle : la règle « 5 % du revenu sous la médiane » redonne la valeur d'optimum.js (test).
   */
  function partDifferee(a, cap) {
    a = Z.archi(a); var t = a.taxe, P = TP.population(t.assiette), moy = TP.HVP.moyenneBrut, W = Z.patrimoineParDixieme(), R = Z.revenusMenages(), A = t.abattement || 0, d, i;
    var totDu = 0, totDiff = 0;
    for (d = 0; d < 10; d++) {
      var k = W[d] / moy, du = 0, paye = 0;
      for (i = 0; i < P.length; i++) {
        var m = P[i], mob = t.nonCotesVente ? m.mobile * (1 - Z.nonCotesPartMobile()) : m.mobile;
        var T = Math.max(0, (m.immo + mob) * k - A) * TP.COMMUN.taux, c = cap(R[d], R[d] / Z.HYP.ucParMenage);
        du += T; paye += Math.min(T, c);
      }
      totDu += du / P.length; totDiff += (du - paye) / P.length;
    }
    return totDu > 0 ? totDiff / totDu : 0;
  }
  /** Règles de plafonnement de la taxe : fonctions (revenu du ménage, revenu par UC) → plafond annuel. tPlat : le prélèvement sur le revenu est compté à ce taux. */
  function regleCap(mode, tPlat) {
    var X = 0.05, med = Z.seuilPlafond(), hautPart = 0.75 - tPlat, medMenage = med * Z.HYP.ucParMenage;
    if (mode === 'actuel') return function (R, r) { return r < med ? X * R : Infinity; };
    if (mode === 'annuel75') return function (R, r) { return r < med ? X * R : hautPart * R; };
    if (mode === 'continu') return function (R) { return (X + (hautPart - X) * Math.min(1, Math.max(0, (R - medMenage) / (HYP.rampe * medMenage)))) * R; };   // H707 : la part plafonnée monte linéairement de 5 % à la médiane à (75 % − taux plat) à (1 + rampe) fois la médiane : plafond continu en R
    throw new Error('règle de plafond inconnue : ' + mode);
  }
  /**
   * Coût de l'option 4 au scénario sc : { croisiere (Md€/an : part non recouvrée du report supplémentaire + abandon de créance de la règle (b)), flux (Md€/an non encaissés les premières années :
   * report supplémentaire recouvré plus tard), stock (créances supplémentaires, Md€), partDifferee, partDiffereeActuelle, abandon }.
   */
  function coutPlafonds(a, sc, o) {
    a = Z.archi(a); o = o || {};
    return exil(a, function () {
      var td = Z.taxe(sc, a), p = TP.PARAM[OF.SC_PATRIMOINE[sc]], i = SCS.indexOf(sc), r0 = 0, dPart = 0, croisiere = 0, flux = 0, abandon = 0;
      if (o.mode) { r0 = partDifferee(a, regleCap('actuel', a.tPlat)); dPart = partDifferee(a, regleCap(o.mode, a.tPlat)) - r0; croisiere += td.brute * dPart * (1 - p.recouvrement); flux = td.brute * dPart * p.recouvrement; }
      if (o.transmission) {
        var nc = td.nonCotes / (1 - Z.HYP.recouvrementNonCotes[OF.SC_PATRIMOINE[sc]]) * Z.HYP.recouvrementNonCotes[OF.SC_PATRIMOINE[sc]];   // taxe sur les non cotés effectivement recouvrée à la vente ou au décès (Md€/an)
        abandon = HYP.partAbandon * HYP.partGardeNc[i] * nc; croisiere += abandon;
      }
      return { croisiere: croisiere, flux: flux, stock: flux * Z.HYP.dureeCreance, partDifferee: r0 + dPart, partDiffereeActuelle: r0, abandon: abandon };
    });
  }

  // ---------- Option 5 : vérification de l'assurance chômage dégressive de la v5
  function chomageV5(a, sc) {
    a = Z.archi(a);
    var st = OF.stOption(OF.opt(Z.versOF(a))), p = F(O.configR(st), { scenario: sc }), ms = M.solde(p);
    return { modele: st.chomage, cout: ms.postes.assuranceChomage, remplace: M.DONNEES.chomage.md };
  }

  // ---------- Assemblage : options → coût (Md€/an) à un scénario
  var IDS = ['cmg', 'tvaTravaux', 'majDegressive', 'plafonds'];
  /** Coût total des options actives (Md€/an, croisière) et détail. opts : { cmg: true, tvaTravaux: true, majDegressive: true | {M, pente, nv1}, plafonds: { mode, transmission }, chomage: true (sans effet) }. */
  function cout(a, sc, opts) {
    opts = opts || {}; a = Z.archi(a); var d = { cmg: 0, tvaTravaux: 0, majDegressive: 0, plafonds: 0 }, pl = null;
    if (opts.cmg) d.cmg = coutCmg(sc);
    if (opts.tvaTravaux) d.tvaTravaux = coutTvaTravaux(sc);
    if (opts.majDegressive) d.majDegressive = surcoutMajDeg(a, sc, opts.majDegressive === true ? {} : opts.majDegressive);
    if (opts.plafonds) { pl = coutPlafonds(a, sc, opts.plafonds); d.plafonds = pl.croisiere; }
    d.total = d.cmg + d.tvaTravaux + d.majDegressive + d.plafonds; d.plafondsDetail = pl;
    return d;
  }
  /** Solde (Md€/an) de l'architecture a avec les options (le solde d'optimum.js moins leur coût). */
  function solde(a, sc, opts) { return Z.solde(a, sc) - cout(a, sc, opts).total; }
  function soldes(a, opts) { var r = {}; SCS.forEach(function (s) { r[s] = solde(a, s, opts); }); return r; }
  /** Plus petit taux plat (dixième de point) au solde central ≥ 0 avec les options ; null si aucun entre 30 et 60 %. */
  function tauxEquilibre(a, opts) {
    var lo = 300, hi = 600, f = function (k) { return solde(F(Z.archi(a), { tPlat: k / 1000 }), 'central', opts) >= 0; };
    if (!f(hi)) return null; if (f(lo)) return lo / 1000;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  /** Valeur d'un point de taux plat (Md€, central) autour du taux de l'architecture. */
  function pointDeTaux(a) { a = Z.archi(a); return Z.solde(F(a, { tPlat: Math.round((a.tPlat + 0.01) * 1000) / 1000 }), 'central') - Z.solde(a, 'central'); }
  /** À trouver ailleurs (Md€/an) pour revenir à l'équilibre central au taux de l'architecture : max(0, − solde central avec les options). */
  function aTrouver(a, opts) { return Math.max(0, -solde(a, 'central', opts)); }
  /** Écart au solde de chaque année pour stress.js (shocks.ajust) : −coût en croisière dès l'année 1, −report supplémentaire (flux) pendant la durée de la créance. Convention d'optimum.js : le coût arrive en régime. */
  function ajustement(a, opts) {
    a = Z.archi(a); var memo = {};
    SCS.forEach(function (sc) { var c = cout(a, sc, opts); memo[sc] = { croisiere: c.total, flux: c.plafondsDetail ? c.plafondsDetail.flux : 0 }; });
    return function (sc, t) { var m = memo[sc]; return -(m.croisiere + (t <= HYP.dureeFlux ? m.flux : 0)); };
  }
  /** Cas types après les options (seule l'option 3 en change : les autres ne touchent aucun cas type, qui n'a ni garde payée, ni travaux, ni patrimoine plafonné). */
  function casTypes(a, opts) {
    opts = opts || {};
    if (opts.majDegressive) return casTypesMajDeg(a, opts.majDegressive === true ? {} : opts.majDegressive);
    var c = Z.casTypes(a), o = {}; Object.keys(c).forEach(function (id) { o[id] = { id: id, avantMois: c[id].avantMois, ecartMois: c[id].ecartMois, ecartAvant: c[id].ecartMois }; });
    return o;
  }

  var API = { HYP: HYP, IDS: IDS, CAS_ISOLE: CAS_ISOLE, GAIN_ISOLE: GAIN_ISOLE, coutCmg: coutCmg, coutTvaTravaux: coutTvaTravaux, ucCas: ucCas, defCas: defCas, niveauVie: niveauVie, enfantsVingtiemes: enfantsVingtiemes,
              paramsMaj: paramsMaj, majEnfant: majEnfant, coutMajDeg: coutMajDeg, coutMajActuelle: coutMajActuelle, surcoutMajDeg: surcoutMajDeg, casTypesMajDeg: casTypesMajDeg, decilesMajDeg: decilesMajDeg, tmeMajDeg: tmeMajDeg, pentePourCas: pentePourCas,
              partDifferee: partDifferee, regleCap: regleCap, coutPlafonds: coutPlafonds, chomageV5: chomageV5, cout: cout, solde: solde, soldes: soldes, tauxEquilibre: tauxEquilibre, pointDeTaux: pointDeTaux,
              aTrouver: aTrouver, ajustement: ajustement, casTypes: casTypes };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.OptionsDu0411 = API;
})(this);
