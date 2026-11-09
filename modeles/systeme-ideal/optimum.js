/*
 * modeles/systeme-ideal/optimum.js — chantier 2 de la boucle « meilleur système » (03/11/2026) : recherche systématique (grille complète) de l'architecture
 * qui satisfait au mieux six contraintes ordonnées. Fonctions pures au-dessus de options_financement.js, taxe_patrimoine.js, palier1.js, patrimoine_*.js,
 * deces_realisation.js et des modules gagnants-perdants (palier1.js, correctifs.js). AUCUN défaut des autres modules n'est modifié. H530 à H560 : methode.md § 33 (affinage du 03/11 : H549-H560).
 *
 * Charger (depuis modeles/systeme-ideal/) : modele.js fiscalite_actuelle.js voies.js sante.js optimisation.js retraites2.js palier1.js patrimoine_financier.js
 *   deces_realisation.js dvf_patrimoine.js patrimoine_immobilier.js taxe_patrimoine.js options_financement.js ../gagnants-perdants/cas_types_donnees.js
 *   ../gagnants-perdants/droit_actuel.js ../gagnants-perdants/modele.js ../gagnants-perdants/palier1.js ../gagnants-perdants/correctifs.js optimum.js
 *
 * Une architecture `a` (champs absents = DEFAUT) :
 *   tPlat           taux plat (0,35 à 0,45)
 *   socle           € par mois et par adulte non retraité (350 à 600)
 *   taxe            null (pas de taxe à 1 %) | { assiette: 'pierre' | 'pierreNet', abattement: €, plafond: null | 0,05 | 0,10 | 0,15 (part du revenu au-delà de laquelle
 *                   la taxe est différée : créance récupérée à la vente ou à la succession, sur le modèle de CGI art. 1391 B ter), nonCotesVente: bool (titres non cotés
 *                   taxés à la vente, pas chaque année) }
 *   tHeritage       taux de l'impôt sur les transmissions (0,40 à 0,50) ; plafond de 50 % de la valeur transmise tous impôts confondus : l'impôt sur le gain au décès s'impute
 *                   sur les droits (décision déléguée du 03/11) ; exceptionConjoint : true (le conjoint survivant ne paie rien, report au second décès)
 *   report150       fin du report d'imposition 150-0 B ter (flux futur)
 *   economies       'aucune' | 'e1' (agences, SNU) | 'e2' (+ primes à l'apprentissage) | 'e2e3' (+ CIR recentré) | 'e2e4' (+ CIR supprimé)
 *   structurelles   'aucune' (défaut) | 'A' (économies structurelles affichables du chantier 3 : 16,1 / 11,7 / 5,8) | 'AB' (avec la réserve : 29,3 / 16,8 / 7,2)
 *   nichesTVA       true : suppression des niches de TVA et d'accises (+8,5 / 4,7 / 2,4, recette)
 *   education       'tuteurRedeploye' (défaut tranché, Q10 : −0,2 / −1,6 / −4,1) | 'economie' (+5,5 / 3,9 / 2,2)
 *                   | 'nonRemplacementExperimentation' (v4, H620 : économie du non-remplacement moins l'expérimentation du tuteur, 36 M€/an)
 *   gestion         'aucune' (défaut) | 'recommandee' (v5, H630 : gestion de collecte et de prestations supprimée − nouveau coût de paiement du socle, informatique en réserve : +8,0 / +4,2 / +1,1)
 *                   | 'avecInformatique' (variante « réserves » : + économie informatique de l'État-plateforme 5,3 / 2,1 / 0,1)
 *   effectifs       'aucune' (défaut) | 'central' (v5, H631 : non-remplacement piloté par l'IA, net du coût numérique, remplace B2 : +0,2 / +0,2 / −0,4) | 'ambitieux' (+6,2 / +0,2 / −0,4)
 *   benchmark       'aucune' (défaut) | 'classeB' (v5, H632 : partie de classe B de l'économie par benchmark européen : nulle) | 'avecClasseC' (réserve : 9 / 4 / 1)
 *   retraitesV6     'aucune' (défaut) | 'ageReference' (v6, H640 : âge de référence indexé seul, effet sur le solde public en 2040 : +12,1 / +3,4 / +0,5 ; avant le 04/11 : +16,9 / +7,4 / +1,6) | 'complet' (dispositif complet de l'auteur du 03/11 : âge de référence + âge libre à coefficient neutre + pénibilité à 60 ans + plancher + niveau : +25,7 / −5,9 / −24,0 ; avant le 04/11 : +28,5 / −5,6 / −26,5). Valeurs de 2040, pas de croisière : voir RETRAITES_V6.
 *   majParentIsole  € par enfant et par mois versés aux parents isolés (correctif b ; 200,78 € = ASF 2026)
 *   alRetraites     true : aide au logement maintenue pour les retraités locataires au minimum vieillesse (correctif a)
 *   capitalDepart   true : capital de départ C du chantier 4 (10,1 / 11,5 / 13,0 Md€/an)
 *   exemptionVie    0 (50 % dès le premier euro, défaut) | 50000 | 100000 : impôt sur l'héritage « reçu à vie » avec exemption par héritier (chantier 4)
 * Affinage du 03/11 (H549 à H560 ; tous à 0 ou au comportement d'avant par défaut) :
 *   abattementActivite  € par mois et par actif : les premiers euros de revenus d'activité ne paient pas le taux plat (levier 1)
 *   bonusActivite       € par mois et par actif : bonus d'activité dégressif intégré au socle (forme de correctifs.js (c) : montée jusqu'à 0,5 Smic, plateau
 *                       jusqu'au Smic, extinction à `bonusFin` Smic) qui remplace la prime d'activité (levier 2)
 *   ppaMaintenue        part (0 à 1) du barème actuel de la prime d'activité maintenue (familiale, sous condition de ressources du foyer) (levier 4)
 *   cleMajoration       'pf' (défaut : coût de la majoration réparti comme les prestations familiales, H540) | 'cas' (réparti sur les dixièmes des parents isolés, H556)
 * Sortie du plancher de 877 € (H561 à H570, 03/11 ; défaut 'sec' = comportement d'avant, plancher versé « sans autre revenu », perdu au premier euro gagné) :
 *   sortiePlancher      'sec' (défaut) | 'maintien' (α = 1 : plancher = minimum garanti sur revenu net + prime, sans règle de retrait propre) | 'degressif' (α = 0,38, comme la
 *                       prime d'activité actuelle) | 'plat' (α = taux plat, aucun paramètre de plus) | 'alpha' (α = `alphaPlancher`). Le complément (plancher − revenu sans activité)
 *                       est retiré à raison de α par euro de revenu net d'activité et de prime d'activité ; il est nul quand le revenu atteint le plancher.
 * Toujours en place (décisions de l'auteur du 03/11) : réforme immobilière (RP exonérée, base réelle, fin des DMTO), décès = réalisation (avec imputation sur les droits),
 * fin de la purge de l'assurance-vie, base réelle partout.
 *
 * Conventions : scénarios du palier 1 (bas = favorable) ; les modules patrimoine sont croisés (OptionsFinancement.SC_PATRIMOINE) ; les correctifs : bas = le moins coûteux.
 */
(function (root) {
  'use strict';
  var req = typeof require !== 'undefined' ? require : null;
  var M = root.SystemeIdeal || (req ? req('./modele.js') : null);
  var V = root.Voies || (req ? req('./voies.js') : null);
  var O = root.Optimisation || (req ? req('./optimisation.js') : null);
  var P1 = root.Palier1 || (req ? req('./palier1.js') : null);
  var R2 = root.Retraites2 || (req ? req('./retraites2.js') : null);
  var OF = root.OptionsFinancement || (req ? req('./options_financement.js') : null);
  var TP = root.TaxePatrimoine || (req ? req('./taxe_patrimoine.js') : null);
  var DR = root.DecesRealisation || (req ? req('./deces_realisation.js') : null);
  var G = root.GagnantsPerdants || (req ? req('../gagnants-perdants/modele.js') : null);
  var GP = root.GagnantsPerdantsPalier1 || (req ? req('../gagnants-perdants/palier1.js') : null);
  var CDC = root.CDC || (req ? (function () { try { return req('../capital-de-depart/continu.js'); } catch (e) { return null; } })() : null);   // fonctions continues (H600+) : facultatif, requis seulement par heritageFonction / capitalFonction
  var C = root.Correctifs || (req ? req('../gagnants-perdants/correctifs.js') : null);
  var D = M.DONNEES, F = V.fus, SCS = ['bas', 'central', 'haut'], XS = OF.SC_PATRIMOINE;

  // ---------- Paramètres et hypothèses (H530-H549)
  var PIB = D.pib;                                  // 2 935 Md€ (2024)
  var SEUIL_HAUT = -0.03 * PIB;                     // contrainte (2) : −88,05 Md€
  var PO_ACTUEL = 0.427 * PIB;                      // prélèvements obligatoires 2024 : 42,7 % du PIB (palier1.js, PO), soit 1 253 Md€ (H546 ⚠️ V7850)
  var DEFAUT = { tPlat: 0.35, socle: 500, taxe: null, tHeritage: 0.5, exceptionConjoint: true, report150: false, economies: 'aucune', structurelles: 'aucune',
                 nichesTVA: false, education: 'tuteurRedeploye', gestion: 'aucune', effectifs: 'aucune', benchmark: 'aucune', retraitesV6: 'aucune', majParentIsole: 200.78, alRetraites: true, capitalDepart: false, exemptionVie: 0, heritageFonction: null, capitalFonction: null,
                 abattementActivite: 0, bonusActivite: 0, bonusFin: 1.6, ppaMaintenue: 0, cleMajoration: 'pf', sortiePlancher: 'sec', alphaPlancher: null, seuilHeures: 0, exil: 'modele' };
  // Architecture finale v2 (H571-H580, 03/11) : fourchettes d'exil (sources/exil-patrimoines-preuves.md § 6.2-6.3), indexées par scénario du PALIER 1 (bas = favorable).
  // fuite : fuite totale des transmissions (M.SCENARIOS[sc].fuiteTransm) ; erosionTop : érosion du capital mobile du top 1 % pour la taxe à 1 % (TaxePatrimoine.PARAM[croisé].erosionTop, H510) ;
  // mobil (facultatif) : mobilité des très hauts revenus (M.SCENARIOS[sc].mobil, H16). « modele » = valeurs des modules (aucun changement) ; « defendable » = fourchette étayée (H571-H572).
  var EXIL = {
    modele: { fuite: { bas: 0.18, central: 0.31, haut: 0.48 }, erosionTop: { bas: 0.20, central: 0.40, haut: 0.74 } },
    defendable: { fuite: { bas: 0.18, central: 0.33, haut: 0.52 }, erosionTop: { bas: 0.20, central: 0.35, haut: 0.55 } }
  };
  // Chantier 4 (modeles/capital-de-depart/resultats.md, 03/11/2026) : capital de départ C (garantie de 40 000 € à 25 ans, dégressive à 50 % de l'héritage reçu), coût [bas, central, haut] ;
  // impôt « reçu à vie » (donations + héritages cumulés par héritier) avec exemption E : part de la recette d'héritage conservée (70,5 / 97,5 à E = 100 000 € ; 81 / 97,5 à E = 50 000 €, H548)
  var CAPITAL_DEPART = [10.1, 11.5, 13.0];
  var PART_VIE = { 0: 1, 50000: 1 - 16.5 / 97.5, 100000: 70.5 / 97.5 };
  function exigerCDC() { if (!CDC) throw new Error('heritageFonction / capitalFonction : charger capital-de-depart/modele.js et continu.js avant optimum.js'); }
  /** Part de la recette d'héritage conservée : exemption par héritier (exemptionVie) ou fonction continue du cumul reçu (heritageFonction = { forme, K }, H601-H603). */
  function partVie(a) { if (a.heritageFonction) { exigerCDC(); return CDC.partConservee(a.heritageFonction.forme, a.heritageFonction.K); } return PART_VIE[a.exemptionVie || 0]; }
  /** Coût du capital de départ (Md€/an) au scénario d'indice i : montants du chantier 4, ou fonction continue de l'héritage reçu (capitalFonction = { forme, K }, H606). */
  function coutCapital(a, i) { if (!a.capitalDepart) return 0; if (a.capitalFonction) { exigerCDC(); return CDC.coutCapital(a.capitalFonction)[i]; } return CAPITAL_DEPART[i]; }
  // Chantier 3 (sources/economies-depense-publique.md § 8, 03/11/2026) : Md€/an, [bas (favorable), central, haut (défavorable)], régime à 10 ans, hors doubles comptes (e1-e4, santé, niches de l'IR)
  var STRUCTURELLES = { aucune: [0, 0, 0], A: [16.1, 11.7, 5.8], AB: [29.3, 16.8, 7.2] };
  var NICHES_TVA = [8.5, 4.7, 2.4];                                         // suppression des niches de TVA et d'accises : recette (prélèvement)
  var EXPERIMENTATION_TUTEUR = 0.036;   // H620 : expérimentation du tuteur IA à trois bras (78 collèges par bras, ≈ 17,1 + 18,9 M€/an, modeles/education/methode.md § 4.5 point 6), comptée chaque année et dans les trois scénarios (prudent : elle ne dure que deux ans)
  var EDUCATION = { tuteurRedeploye: [-0.2, -1.6, -4.1], economie: [5.5, 3.9, 2.2],   // Q10 tranchée par Claude : redéploiement (coût du tuteur) ; variante « économie »
                    nonRemplacementExperimentation: [5.5 - EXPERIMENTATION_TUTEUR, 3.9 - EXPERIMENTATION_TUTEUR, 2.2 - EXPERIMENTATION_TUTEUR] };   // dilemme 3 tranché par l'auteur (03/11) : non-remplacement, le tuteur n'est compté qu'au coût de son expérimentation (H620)
  // Architecture v5 (03/11 au soir, H630-H634) : économies documentées des trois chantiers du 03/11 au soir. Md€/an, régime de croisière, [bas (favorable), central, haut (défavorable)] :
  // ATTENTION, les rapports sources (sources/economies-*.md) donnent « bas / central / haut » pour l'AMPLEUR de l'économie (bas = prudent) : ici l'ordre est inversé (convention du modèle).
  var GESTION = {   // sources/economies-gestion-simplification.md § 2 (rapport : 2,37 / 4,90 / 8,44 pour bas / central / haut)
    // Corrigé le 04/11/2026 (V12470-V12485, V9952-V9955 ; sources/gestion-effectifs-fiabilisation.md, cas S4 de sensibilite_gestion_effectifs.js ; V12410) : (a) base de gestion de la CAF lue au PLACSS 2023 (2,68 Md€ brut au central, 2,39 net au bas, 3,20 au haut) au lieu de 3,20 partout ; (b) plafond des départs : les lignes des organismes de sécurité sociale (hors DGFiP et collectivités) ne dépassent pas ce que 21 452 départs en 10 ans permettent (14 849 retraites × 1,5 de sorties hors retraite : le ×1,5 est une hypothèse), 30 % de la gestion hors masse salariale ; part conservée 36 / 64 / 100 % ; ⚠️ les lignes L1c (MSA, Agirc-Arrco, caisses) et L2b (France Travail) restent comptées bien que leurs bases ne soient pas publiées (V9952 : −1,56 Md€ au central si on les retirait, choix de prudence laissé à l'auteur). Ancien : 8,44 / 4,90 / 2,37.
    supprimee: [5.8174, 3.7986, 2.1068],  // gestion supprimée L1 + L2 après base CAF lue et plafond des départs
    collectivites: [0.16, 0.05, 0.01],   // L1d : régie fiscale des collectivités, déjà dans A1 (structurelles A) : retirée (§ 5 du rapport)
    coutSocle: [0.32, 0.64, 1.46],       // L4 (défavorable 1,46 au lieu de 1,27 le 04/11/2026 : coût Cnav 0,92 % au lieu de 0,8 %, V12470) ; : nouveau coût de paiement du socle et de l'allocation unique, absent du modèle (coût manquant), 0,2 / 0,4 / 0,8 % de 159 Md€
    informatique: [5.34, 2.12, 0.10]     // L3 : État-plateforme, en réserve (recrutement massif, transition de 28 Md€ hors solde)
  };
  var EFFECTIFS_IA = {   // sources/economies-effectifs-publics-ia.md § 5 : net du coût numérique ; remplace B2 (qui n'est pas dans les structurelles A)
    // Corrigé le 04/11/2026 (V12483-V12485, V12411) : temps libéré par l'IA à 10 ans 2,5 / 6 / 15 % au lieu de 5 / 15 / 33 % (Danemark 2,8 %, HMRC 2 %, GDS 5,9 %, DITP 12-16 % sur deux tâches) ; ancien : central 0,2 / 0,2 / −0,4 ; ambitieux 6,2
    central: [-0.11, -0.11, -0.4],  // H631 : central du rapport au favorable et au central ; « bas » du rapport (outil plus cher que le gain) au défavorable
    ambitieux: [2.28, -0.11, -0.4]     // variante « IA ambitieuse » : haut du rapport (84 % des départs du vivier non remplacés) au favorable seulement
  };
  var BENCHMARK = {   // sources/economies-benchmark-europeen.md § 5 : additionnelle 12,6 / 6,4 / 2,0 dont 9 / 4 / 1 hors déchets, toute de classe C ; classe B additionnelle : 0
    classeB: [0, 0, 0],
    avecClasseC: [9, 4, 1]
  };
  // Option « retraites_v6 » (03/11 au soir, H640) : dispositif retraites décidé par l'auteur (modeles/retraites/resultats.md, § « Âge de référence indexé », hypothèses H61-H70). NON comprise dans les défauts ni dans les architectures v1 à v5.
  // Effet sur le solde public (Md€ de 2025 par an ; dépense de pensions + recettes de ceux qui travaillent plus longtemps), ordre du modèle [favorable, central, défavorable]. ATTENTION : ce sont les valeurs de l'année 2040
  // (régime de montée en charge), pas un régime de croisière : le solde de l'architecture à 10 ans les reçoit tel quel quand l'option est active (lecture : « si le dispositif était à son niveau de 2040 »).
  // MISE À JOUR 04/11/2026 (V12840-V12859) : valeurs recalculées avec les paramètres de comportement sourcés (modeles/retraites/age_libre.js, SCENARIOS_REF ; sources/retraites-comportements.md) et le coût de substitution (chômage, invalidité, maladie).
  // Ancien -> nouveau, [favorable, central, défavorable] : ageReference 2040 [16.9, 7.4, 1.6] -> [12.1, 3.4, 0.5] ; 2060 [69.5, 30.0, 6.9] -> [52.0, 14.0, 2.4] ; complet 2030 [-6.1, -21.4, -34.2] -> [-5.7, -20.8, -33.6] ;
  // complet 2040 [28.5, -5.6, -26.5] -> [25.7, -5.9, -24.0] ; complet 2060 [109.1, 26.7, -16.4] -> [96.9, 20.1, -12.7]. L'âge de référence seul est net de la substitution (brut 2040 : [13.5, 4.2, 0.8]).
  var RETRAITES_V6 = {
    ageReference: { m2030: [0, 0, 0], m2040: [12.1, 3.4, 0.5], m2060: [52.0, 14.0, 2.4] },        // âge de référence indexé seul (2/3 de chaque année d'espérance de vie gagnée au travail ; passage 0,8 / 0,5 / 0,33 vers l'âge effectif)
    complet:      { m2030: [-5.7, -20.8, -33.6], m2040: [25.7, -5.9, -24.0], m2060: [96.9, 20.1, -12.7] }   // + âge libre (coefficient neutre ; passageLibre 0,2 / 0,35 / 0,5 : hypothèse assumée, sans étude), départ à 60 ans sans réduction pour 10 % des départs (part nette du droit actuel), plancher 1 300 €, indexation −0,5 pt au-dessus de 2 000 €, contribution de 20 % au-dessus de 2 500 € nets
  };

  /** Effet des retraites v6 sur le solde public (Md€/an) à l'année civile `annee` (interpolation linéaire entre 2030, 2040 et 2060 ; constante hors de [2030, 2060]) pour le scénario d'indice i. */
  function retraitesV6Annee(mode, i, annee) {
    var r = RETRAITES_V6[mode]; if (!r) return 0;
    var y = Math.min(2060, Math.max(2030, annee));
    if (y <= 2040) return r.m2030[i] + (r.m2040[i] - r.m2030[i]) * (y - 2030) / 10;
    return r.m2040[i] + (r.m2060[i] - r.m2040[i]) * (y - 2040) / 20;
  }
  /** Effet de l'option au scénario d'indice i, valeur de 2040 (celle que reçoit le solde). */
  function retraitesV6Solde(a, i) { return !a.retraitesV6 || a.retraitesV6 === 'aucune' ? 0 : RETRAITES_V6[a.retraitesV6].m2040[i]; }
  var HYP = {
    ucParMenage: 1.5,                // H535 ⚠️ : unités de consommation par ménage (moyenne nationale ≈ 1,5 ; V7851)
    recouvrementNonCotes: { bas: 0.70, central: 0.85, haut: 0.95 },   // H538 ⚠️ : part de la taxe sur les non-cotés récupérée à la vente ou à la succession (scénarios du module : bas = le moins favorable)
    effortMax: 0.10,                 // contrainte (6)
    retraiteModeste: { valeurImmo: 300000, revenuMensuel: 1400, dettes: 0, uc: 1 },   // cas type de taxe-patrimoine-1pc.md § 7 (maison 300 000 €, pension 1 400 €)
    fondateur: { valeurImmo: 0, actions: 10e6, revenuMensuel: 4000, uc: 1 },        // cas type d'information (parts non cotées de 10 M€)
    margMax: 0.75 + 1e-9,            // contrainte (5)
    plafondSousConditionRevenu: true, // H539 : comme CGI art. 1391 B ter (dégrèvement réservé aux revenus sous le plafond de l'art. 1417 II), le plafonnement ne vaut que sous la médiane de niveau de vie
    dureeCreance: 12                 // H537 ⚠️ : années moyennes entre le différé et la vente ou la succession (stock de créances = flux × durée)
  };
  var ECO = { aucune: { e: 'aucune', cir: 'inchange' }, e1: { e: 'prudentes', cir: 'inchange' }, e2: { e: 'volontaires', cir: 'inchange' },
              e2e3: { e: 'volontaires', cir: 'recentre' }, e2e4: { e: 'volontaires', cir: 'supprime' } };

  function archi(a) { var o = F(DEFAUT, a || {}); return o; }
  /** Variante d'exil d'une architecture : null pour « modele » (on lit les modules tels quels), sinon { fuite, erosionTop, mobil } (objets par scénario du palier 1, champs facultatifs). */
  function exilVariante(v) {
    if (!v || v === 'modele') return null;
    if (typeof v === 'string') { if (!EXIL[v]) throw new Error('exil inconnu : ' + v); return EXIL[v]; }
    return v;
  }
  /**
   * Exécute fn() avec les paramètres d'exil de la variante v posés dans les modules (M.SCENARIOS et TaxePatrimoine.PARAM), puis les restaure (finally) : H573.
   * Les caches de ce module portent la signature des paramètres (sig), donc une variante ne lit jamais le cache d'une autre.
   */
  function avecExil(v, fn) {
    var x = exilVariante(v); if (!x) return fn();
    var save = SCS.map(function (sc) { return [M.SCENARIOS[sc].fuiteTransm, TP.PARAM[XS[sc]].erosionTop, M.SCENARIOS[sc].mobil]; });
    SCS.forEach(function (sc) {
      if (x.fuite) M.SCENARIOS[sc].fuiteTransm = x.fuite[sc];
      if (x.erosionTop) TP.PARAM[XS[sc]].erosionTop = x.erosionTop[sc];
      if (x.mobil) M.SCENARIOS[sc].mobil = x.mobil[sc];
    });
    try { return fn(); } finally { SCS.forEach(function (sc, i) { M.SCENARIOS[sc].fuiteTransm = save[i][0]; TP.PARAM[XS[sc]].erosionTop = save[i][1]; M.SCENARIOS[sc].mobil = save[i][2]; }); }
  }
  function sig(sc) { var S = M.SCENARIOS[sc]; return S.fuiteTransm + '~' + S.mobil + '~' + TP.PARAM[XS[sc]].erosionTop; }
  /** Objet d'options_financement.js correspondant (sans la taxe à 1 %, comptée ici avec ses variantes). */
  function versOF(a) {
    var e = ECO[a.economies];
    return { tPlat: a.tPlat, socleFacteur: a.socle / OF.SOCLE_DEFAUT, heritage: 'palier1', report150: !!a.report150, deces: 'credit', finPurgeAV: true,
             economies: e.e, cir: e.cir, immobilier: true, taxePatrimoine: null };
  }

  // ---------- Héritage plafonné (H531-H533)
  /** Droits sur les transmissions à un taux t (formule de modele.js, fuite proportionnelle au taux), Md€/an. */
  function droits(sc, t) { return OF.transmissionsMd(sc, { t: t, ajout: 0 }); }
  /**
   * Décès = réalisation sous le plafond de 50 % : l'impôt sur le gain au décès s'impute sur les droits de la même classe d'actifs ; seul l'excédent éventuel est une recette.
   * Le taux sur le gain est le taux plat (≤ 45 %) et le gain est une fraction de la valeur : à des droits de 40 % ou plus, l'excédent est nul (H532).
   */
  var _dc = {};
  function decesPlafonne(sc, a) {
    var kk = sc + '|' + a.tPlat + '|' + a.tHeritage + '|' + sig(sc); if (_dc[kk] !== undefined) return _dc[kk];
    var s = XS[sc], r = DR.realisationDeces(s, { t: a.tPlat, deductible: false }), v = DR.valeurs(s), fuite = M.SCENARIOS[sc].fuiteTransm * Math.min(1.5, a.tHeritage / 0.5), x = 0, c;
    for (c in r.parClasse) x += Math.max(0, r.parClasse[c].brutes - a.tHeritage * (1 - fuite) * v[c]);
    _dc[kk] = x; return x;
  }
  /** Coût de l'exception du conjoint survivant (Md€/an) : la part de la valeur transmise qui va au conjoint (deces_realisation.js PARAM.cj : 25 / 18 / 10 %) sort de l'assiette (H533 ⚠️). */
  function coutConjoint(sc, a) { return a.exceptionConjoint ? DR.PARAM[XS[sc]].cj * droits(sc, a.tHeritage) * partVie(a) : 0; }
  /** Perte de recette d'héritage due à l'exemption « reçu à vie » (Md€/an, ≥ 0) : part perdue × droits du scénario (H548). */
  function perteExemption(sc, a) { return (1 - partVie(a)) * droits(sc, a.tHeritage); }
  /** Taux de prélèvement total maximal sur une transmission (contrainte 4) : max(droits, impôt sur le gain imputé) ; > 50 % seulement sans imputation. */
  function tauxTransmissionMax(a) { return Math.max(a.tHeritage, a.tPlat); }

  // ---------- Taxe à 1 % : variantes de la grille (H534-H539)
  var _rev = null;
  /** Revenu disponible annuel par ménage par dixième de niveau de vie (Insee, DINA par UC × UC par ménage, H535). */
  function revenusMenages() { if (!_rev) _rev = G.DINA.rdb.map(function (x) { return x * HYP.ucParMenage; }); return _rev; }
  /** Patrimoine brut moyen par ménage par dixième de niveau de vie : quartiles HVP (Insee Focus 371, figure 3b) répartis sur les dixièmes (D3 et D8 à cheval), H536 ⚠️. */
  function patrimoineParDixieme() {
    var q = TP.HVP.quartilesNiveauVie;
    return [q[0], q[0], (q[0] + q[1]) / 2, q[1], q[1], q[2], q[2], (q[2] + q[3]) / 2, q[3], q[3]];
  }
  var _taxeCache = {};
  /**
   * Distribution de la taxe et du différé : pour chaque dixième de niveau de vie, les ménages ont la forme de patrimoine de l'enquête HVP (2 000 quantiles), mise à
   * l'échelle de la moyenne du dixième, et le revenu moyen du dixième (H536 : pas de dispersion du revenu à patrimoine donné, ce qui sous-estime le différé des
   * retraités riches en patrimoine et pauvres en revenu). Renvoie : part différée de la taxe (sur la population), et charge nette en trésorerie par dixième
   * (€/UC/mois : taxe payée moins la taxe foncière moyenne équivalente supprimée, H534 ⚠️), et charge économique (taxe due, créance comprise).
   */
  function distributionTaxe(t) {
    if (!t) return { partDifferee: 0, chargeTresorerie: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], chargeEconomique: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], partNonCotes: 0 };
    var cle = [t.assiette, t.abattement || 0, t.plafond || 0, t.nonCotesVente ? 1 : 0, HYP.plafondSousConditionRevenu ? 1 : 0].join('|');
    if (_taxeCache[cle]) return _taxeCache[cle];
    var P = TP.population(t.assiette), moy = TP.HVP.moyenneBrut, W = patrimoineParDixieme(), R = revenusMenages(), A = t.abattement || 0, X = t.plafond || 0;
    var tf = TP.RECETTES.tfMenages / (TP.CN.logements + TP.CN.autresBatiments + TP.CN.terrainsBatis + TP.CN.autresNonProduits), d, i;
    var totDu = 0, totDiff = 0, tres = [], eco = [];
    for (d = 0; d < 10; d++) {
      var k = W[d] / moy, du = 0, paye = 0, tfx = 0;
      for (i = 0; i < P.length; i++) {
        var m = P[i], mob = t.nonCotesVente ? m.mobile * (1 - nonCotesPartMobile()) : m.mobile;
        var T = Math.max(0, (m.immo + mob) * k - A) * TP.COMMUN.taux, cap = (X && eligible(R[d] / HYP.ucParMenage)) ? X * R[d] : Infinity;
        du += T; paye += Math.min(T, cap); tfx += tf * (m.immo + m.dettes) * k;   // taxe foncière supprimée : sur la valeur brute du bien
      }
      du /= P.length; paye /= P.length; tfx /= P.length;
      totDu += du; totDiff += du - paye;
      tres.push((paye - tfx) / HYP.ucParMenage / 12); eco.push((du - tfx) / HYP.ucParMenage / 12);
    }
    var r = { partDifferee: totDu > 0 ? totDiff / totDu : 0, chargeTresorerie: tres, chargeEconomique: eco };
    _taxeCache[cle] = r; return r;
  }
  /** Seuil de revenu du plafonnement (€/UC/an) : médiane du revenu disponible par UC (milieu de D5 et D6, DINA). */
  function seuilPlafond() { var r = G.DINA.rdb; return (r[4] + r[5]) / 2; }
  function eligible(revUC) { return !HYP.plafondSousConditionRevenu || revUC < seuilPlafond(); }
  /** Part des non-cotés dans le capital mobile taxable (comptes nationaux, scénario central du module : actions × (1 − part cotée) × valorisation / base mobile). */
  function nonCotesPartMobile() {
    var p = TP.PARAM.central, c = TP.composantes('pierre'), nc = c.actions * (1 - p.partCotees) * p.valNonCotees;
    return nc / (c.actions * p.partCotees + c.opc + nc);
  }
  /**
   * Recette nette de la taxe (Md€/an), scénario du palier 1 (croisé avec celui du module). Croisière : la créance différée est récupérée à la vente ou à la succession
   * (recouvrement du module : 90 / 95 / 100 %, H515) et porte intérêt au taux de la dette (H537 : pas de coût de portage). Trésorerie : la part différée manque tant que
   * les premières créances ne sont pas échues. Titres non cotés à la vente : la recette correspondante est encaissée à la vente (recouvrement H538).
   */
  var _tx = {};
  function taxe(sc, a) {
    var t = a.taxe; if (!t) return { nette: 0, tresorerieAn1: 0, brute: 0, differe: 0, stockCreances: 0, nonCotes: 0, partDifferee: 0 };
    var kk = sc + '|' + [t.assiette, t.abattement || 0, t.plafond || 0, t.nonCotesVente ? 1 : 0, HYP.plafondSousConditionRevenu ? 1 : 0, sig(sc)].join('|'); if (_tx[kk]) return _tx[kk];
    return (_tx[kk] = taxeCalc(sc, a));
  }
  function taxeCalc(sc, a) {
    var t = a.taxe;
    var s = XS[sc], p = TP.PARAM[s], r = TP.recette(s, { assiette: t.assiette, abattement: t.abattement || 0, differe: false, avecReformeImmo: true });
    var dist = distributionTaxe(t), differe = r.brute * dist.partDifferee;
    var perteDiff = differe * (1 - p.recouvrement);
    var nc = 0;
    if (t.nonCotesVente) {
      var c = TP.composantes(t.assiette), mobNC = c.actions * (1 - p.partCotees) * p.valNonCotees * (1 - r.erosionMobile) * (1 - r.partAbattement.mobile);
      nc = TP.COMMUN.taux * mobNC * (1 - HYP.recouvrementNonCotes[s]);
    }
    var nette = r.nette - perteDiff - nc;
    return { nette: nette, brute: r.brute, differe: differe, perteDiffere: perteDiff, nonCotes: nc, tresorerieAn1: nette - (differe - perteDiff) - (t.nonCotesVente ? nc / (1 - HYP.recouvrementNonCotes[s]) * HYP.recouvrementNonCotes[s] : 0),
             stockCreances: differe * HYP.dureeCreance, partDifferee: dist.partDifferee };
  }
  /** Effort d'un cas type (part du revenu payée dans l'année) : contrainte (6). */
  function effort(cas, a) {
    var t = a.taxe; if (!t) return 0;
    var r = TP.casType(cas, { assiette: t.assiette, abattement: t.abattement || 0 }), rev = 12 * cas.revenuMensuel, imp = r.impot;
    if (t.nonCotesVente && cas.actions) imp = Math.max(0, ((cas.valeurImmo || 0) - (t.assiette === 'pierreNet' ? (cas.dettes || 0) : 0)) - (t.abattement || 0)) * TP.COMMUN.taux;
    if (t.plafond && eligible(rev / (cas.uc || 1))) imp = Math.min(imp, t.plafond * rev);
    return imp / rev;
  }

  // ---------- Correctifs (gagnants-perdants/correctifs.js) : (a) aide au logement des retraités, (b) majoration parent isolé à montant variable
  function coutCorrectifs(sc, a) {
    var ca = a.alRetraites ? C.coutA(sc).md : 0, cb = C.coutB(sc).md * a.majParentIsole / C.HYP.asf * (sc === 'haut' ? C.HYP.asf / C.SC.haut.asfMontant : 1);
    // au haut, coutB utilise 300 €/enfant : on garde l'effectif du haut (partParent = 1) au montant choisi
    return { a: ca, b: cb, total: ca + cb };
  }

  // ---------- Solde
  var _base = {};
  /** Solde d'options_financement.js (palier 1 au taux et au socle de l'architecture, réforme immobilière, décès avec crédit, fin de purge AV, report, économies), mis en cache. */
  function soldeOF(a, sc) {
    var k = [a.tPlat, a.socle, a.report150 ? 1 : 0, a.economies, sc, sig(sc)].join('|');
    if (_base[k] === undefined) _base[k] = OF.solde(versOF(a), sc);
    return _base[k];
  }
  /** Décomposition du solde public (Md€/an, croisière, déficit actuel compris). */
  /** Poste « gestion » (v5, H630) au scénario d'indice i : gestion supprimée − part des collectivités (déjà dans A1) − nouveau coût du socle (+ informatique en variante). */
  function gestionNette(a, i) {
    if (a.gestion === 'aucune') return 0;
    var g = GESTION.supprimee[i] - GESTION.collectivites[i] - GESTION.coutSocle[i];
    return a.gestion === 'avecInformatique' ? g + GESTION.informatique[i] : g;
  }
  function detail(a, sc) { a = archi(a); return avecExil(a.exil, function () { return detailBrut(a, sc); }); }
  function detailBrut(a, sc) {
    var of = soldeOF(a, sc), dH = droits(sc, a.tHeritage) - droits(sc, 0.5), dc = decesPlafonne(sc, a), cj = coutConjoint(sc, a), tx = taxe(sc, a), corr = coutCorrectifs(sc, a);
    var i = SCS.indexOf(sc), st = STRUCTURELLES[a.structurelles][i], tva = a.nichesTVA ? NICHES_TVA[i] : 0, edu = EDUCATION[a.education][i];
    var gst = gestionNette(a, i), ia = a.effectifs === 'aucune' ? 0 : EFFECTIFS_IA[a.effectifs][i], bm = a.benchmark === 'aucune' ? 0 : BENCHMARK[a.benchmark][i], ret = retraitesV6Solde(a, i);
    var ex = perteExemption(sc, a), cap = coutCapital(a, i), pr = coutProtection(a, sc);
    var total = of + dH + dc - cj + tx.nette - corr.total + st + tva + edu + gst + ia + bm + ret - ex - cap - pr.total;
    return { options: of, heritage: dH, deces: dc, conjoint: -cj, exemptionVie: -ex, capitalDepart: -cap, taxe: tx.nette, correctifs: -corr.total, structurelles: st, nichesTVA: tva, education: edu, gestion: gst, effectifs: ia, benchmark: bm, retraites: ret,
             protection: -pr.total, total: total, taxeDetail: tx, correctifsDetail: corr, protectionDetail: pr };
  }
  function solde(a, sc) { return detail(a, sc).total; }
  function soldes(a) { var r = {}; SCS.forEach(function (s) { r[s] = solde(a, s); }); return r; }

  // ---------- Prélèvements obligatoires (objectif « au moins autant de recettes qu'aujourd'hui », H546)
  /**
   * Variation des prélèvements par rapport à aujourd'hui (Md€/an) : recettes du palier 1 (impôt plat, continu, IS, retraités, transmissions) − 885,9 supprimés − crédit d'IS des holdings
   * + contribution des hautes pensions + options patrimoniales (report, PFU, AV, immobilier net des DMTO) + taxe à 1 % + écart d'héritage ; hors dépenses (socle, correctifs, économies).
   */
  function prelevements(a, sc) { a = archi(a); sc = sc || 'central'; return avecExil(a.exil, function () { return prelevementsBrut(a, sc); }); }
  function prelevementsBrut(a, sc) {
    var o = OF.opt(versOF(a)), st = OF.stOption(o), ms = M.solde(F(O.configR(st), { scenario: sc }));
    var hp = R2.contribution(P1.HP, sc).netMd, pat = OF.patrimoine(o, sc).total, im = OF.immobilier(o, sc);
    var delta = ms.recettes.total - D.prelevementsSupprimes - ms.postes.creditHoldings + hp + pat + im + taxe(sc, a).nette + (droits(sc, a.tHeritage) - droits(sc, 0.5)) + decesPlafonne(sc, a) - coutConjoint(sc, a)
      + (a.nichesTVA ? NICHES_TVA[SCS.indexOf(sc)] : 0) - perteExemption(sc, a);
    // affinage (H557) : l'abattement sur les revenus d'activité est un moindre prélèvement ; le bonus d'activité et la prime d'activité maintenue sont des transferts
    var pr = coutProtection(a, sc); delta -= pr.abattement;
    // net des transferts monétaires : le socle et l'allocation par enfant remplacent des prestations (117,6 Md€) ; un impôt négatif gonfle les prélèvements bruts
    var transferts = ms.postes.socleAdultes + ms.postes.enfants - ms.postes.depensesRemplacees + pr.bonus + pr.ppa + pr.plancher;
    return { delta: delta, total: PO_ACTUEL + delta, actuel: PO_ACTUEL, partPIB: (PO_ACTUEL + delta) / PIB, transfertsNets: transferts, deltaNet: delta - transferts };
  }

  // ---------- Gagnants et perdants (central)
  var _dec = {}, _cas = {};
  function decilesBase(a) {
    var k = a.tPlat + '|' + a.socle;
    if (!_dec[k]) _dec[k] = C.decilesCorriges(versOF(a), undefined, { a: true });
    return _dec[k];
  }
  function casBase(a) {
    var k = a.tPlat + '|' + a.socle;
    if (!_cas[k]) { var o = {}; C.casTypes(versOF(a), undefined, { a: true }).forEach(function (c) { o[c.id] = c; }); _cas[k] = o; }
    return _cas[k];
  }
  var _pf = null;
  function clePF() {
    if (_pf) return _pf;
    var uc = G.ucParDecile(), s = 0, i, pf = [];
    for (i = 0; i < 10; i++) { pf.push(G.FPS.prestationsFamiliales[i] * uc[i]); s += pf[i]; }
    _pf = pf.map(function (x, j) { return x / s / (uc[j] * 1e6 * 12); }); return _pf;
  }
  /**
   * Écart de revenu disponible par dixième de niveau de vie (€/UC/mois, central) : palier 1 au taux et au socle + correctif (a) (correctifs.js) + majoration parent isolé
   * (coût central réparti comme les prestations familiales, comme correctifs.js) − charge de trésorerie de la taxe à 1 % nette de la taxe foncière (H534).
   * `economique` : la même chose avec la taxe due (créance différée comprise).
   */
  function deciles(a) {
    a = archi(a);
    var b = decilesBase(a), cb = C.coutB('central').md * a.majParentIsole / C.HYP.asf * 1e9, k = a.cleMajoration === 'cas' ? cleCas() : clePF(), dist = distributionTaxe(a.taxe);
    var prot = protectionDeciles(a);
    return b.map(function (x, i) {
      var maj = cb * k[i], aj = x.ajout;   // x.ajout : correctif (a) seul ; la majoration (b) entière est dans `maj`
      return { decile: x.decile, palier: x.ecartInitial, correctifs: aj + maj, protection: prot[i], taxe: -dist.chargeTresorerie[i], ecart: x.ecartInitial + aj + maj + prot[i] - dist.chargeTresorerie[i],
               economique: x.ecartInitial + aj + maj + prot[i] - dist.chargeEconomique[i] };
    });
  }
  /** Cas types (€/mois, central) après correctifs : (a) via correctifs.js, majoration parent isolé au montant de l'architecture. Locataires : pas de taxe à 1 %. */
  function casTypes(a) {
    a = archi(a);
    var b = casBase(a), out = {}, id;
    for (id in b) {
      var c = b[id], e = c.ecartMois, def = GP.CAS_TYPES.filter(function (x) { return x.id === id; })[0], s = typeof def.s === 'function' ? def.s() : def.s;
      if (s && s.adultes === 1 && s.enfants > 0) e += a.majParentIsole * s.enfants;
      if (!a.alRetraites && def.perdAL) e = c.ecartInitialMois;
      var pr = protectionCas(a, id);
      out[id] = { id: id, libelle: c.libelle, avantMois: c.avantMois, ecartMois: e + pr, protectionMois: pr };
    }
    return out;
  }


  // ---------- Affinage du 03/11 : protéger les bas salaires au moindre coût (H549-H556)
  var SMIC = GP.SMIC_BRUT, PPA_MD = D.primeActiviteMd, PPA_PARAMETRES = 8;   // H554 : 10,65 Md€ (CNAF 2024, modele.js) ; barème à 8 paramètres (H555)
  // H553 : cas type → cas de l'atlas OpenFisca 2026 dont on lit la prime d'activité (colonne 2), au salaire brut de l'actif
  var ATLAS_PPA = { smic_seul: 'celib_locataire_z2', cadre_2x: 'celib_locataire_z2', cadre_4x: 'celib_locataire_z2', couple_1smic_2enf: 'couple_monoactif_2_z2',
                    couple_2smic_2enf: 'couple_biactif_2_z2', parent_isole_smic: 'isole_2_z2' };
  var DISP = { bas: C.SC.bas.disp, central: C.SC.central.disp, haut: C.SC.haut.disp };
  /** Actifs d'un cas type : nombre et coût employeur mensuel de chacun (0 si sans emploi ou retraité). */
  function actifsCas(id) {
    var def = GP.CAS_TYPES.filter(function (x) { return x.id === id; })[0], s = def && (typeof def.s === 'function' ? def.s() : def.s);
    if (!s || def.retraite || !(s.heuresSemaine > 0)) return { n: 0, cout: 0 };
    var ch = s.coutHoraire || (s.coutMensuelPlein / (35 * 52 / 12));
    return { n: s.deuxEmplois ? 2 : 1, cout: ch * Math.min(s.heuresSemaine, 35) * 52 / 12 };
  }
  /** Gain mensuel d'UN actif de coût employeur `cout` (€/mois) dû aux leviers 1 et 2 (individuels). */
  function gainIndividuel(a, cout) {
    var g = 0;
    if (a.abattementActivite > 0) g += a.tPlat * Math.min(cout, a.abattementActivite);              // H549 : le taux plat ne s'applique pas aux A premiers euros
    if (a.bonusActivite > 0) g += C.bonus(C.brutDeCout(cout), a.bonusActivite, a.bonusFin);         // H551 : forme du correctif (c)
    return g;
  }
  /** Gain mensuel d'un cas type dû aux leviers de protection (€/mois). La prime d'activité maintenue est lue sur l'atlas OpenFisca au salaire brut (H553). */
  function protectionCas(a, id) {
    var x = actifsCas(id); if (!x.n) return 0;
    var g = x.n * gainIndividuel(a, x.cout);
    if (id === 'smic_seul' && alphaSortie(a) !== null) g += complementPlancher(a, 'seul', x.cout);   // H565 : seul le smicard seul, locataire, est calculé
    if (a.ppaMaintenue > 0 && ATLAS_PPA[id]) g += a.ppaMaintenue * GP.atlas(ATLAS_PPA[id], C.brutDeCout(x.cout), 2);
    // H591 : sans prime d'activité, le complément de plancher est aussi la protection du parent isolé et du couple monoactif (la prime les protégeait) ; ne change aucun résultat avec ppaMaintenue > 0
    if (a.ppaMaintenue === 0 && alphaSortie(a) !== null) {
      if (id === 'parent_isole_smic') g += complementPlancher(a, 'parent', x.cout);
      if (id === 'couple_1smic_2enf') g += complementPlancher(a, 'couple', x.cout);
    }
    return g;
  }

  // ---------- Sortie du plancher de 877 € (H561-H570, 03/11)
  // Le solde de `OptionsFinancement` ne verse le plancher qu'aux 1,84 M de bénéficiaires SANS AUCUN autre revenu (H134 de systeme-ideal) : la sortie 'sec' est donc une falaise (le complément de
  // 877 − 350 = 527 € du seul adulte disparaît au premier euro gagné). Les variantes prolongent le plancher en complément retiré à raison de α (H561).
  var PLANCHER = D.rsa.niveau;                         // 877 € (RSA + aide au logement d'une personne seule, T14)
  var SORTIES = { sec: null, maintien: 1, degressif: 0.38, plat: 'tPlat' };   // α de retrait (H562 : 0,38 = taux de retrait de la prime d'activité actuelle, CSS art. D. 843-1 ⚠️ V8200)
  var ETA_PARTICIPATION = 0.4, FACTEUR_PARTICIPATION = { bas: 0.5, central: 1, haut: 1.5 };   // H567 : profil D1-D2 d'offre-de-travail/modele.js (Immervoll et al. 2007) et facteurs des scénarios
  var TYPES_MENAGE = {   // H563 : ménages types locataires zone 2 (atlas OpenFisca 2026) ; le plancher est de 877 € par adulte, 1 300 € pour le parent isolé (palier1.js H109)
    seul: { atlas: 'celib_locataire_z2', ppa: 'celib_locataire_z2', adultes: 1, enfants: 0, age: 40, garantie: PLANCHER, libelle: 'personne seule' },
    parent: { atlas: 'isole_2_z2', ppa: 'isole_2_z2', adultes: 1, enfants: 2, age: 35, garantie: Math.max(PLANCHER, GP.PLANCHER_PARENT_ISOLE), maj: true, libelle: 'parent isolé, 2 enfants' },
    couple: { atlas: 'couple_monoactif_2_z2', ppa: 'couple_monoactif_2_z2', adultes: 2, enfants: 2, age: 40, garantie: 2 * PLANCHER, libelle: 'couple, 2 enfants, un seul salaire' }
  };
  /** α de retrait du complément de plancher pour une architecture (null = falaise 'sec'). */
  function alphaSortie(a) {
    var v = a.sortiePlancher === 'alpha' ? a.alphaPlancher : SORTIES[a.sortiePlancher];
    if (v === undefined) throw new Error('sortiePlancher inconnue : ' + a.sortiePlancher);
    return v === 'tPlat' ? a.tPlat : v;
  }
  /** Revenu disponible mensuel d'un ménage type dont l'actif perçoit un coût employeur `c` (€/mois), hors complément de plancher : barème du système + leviers (H563). */
  function revenuBase(a, p, t, c) {
    var T = TYPES_MENAGE[t], b = C.brutDeCout(c);
    var r = c > 0 ? M.situation({ adultes: T.adultes, enfants: T.enfants, age: T.age, heuresSemaine: 35, coutMensuelPlein: c }, p).apresMois : M.situation({ adultes: T.adultes, enfants: T.enfants, age: T.age, heuresSemaine: 0 }, p).apresMois;
    if (T.maj) r += a.majParentIsole * T.enfants;
    if (c > 0) { r += gainIndividuel(a, c); if (a.ppaMaintenue > 0) r += a.ppaMaintenue * GP.atlas(T.ppa, b, 2); }
    return r;
  }
  /** Complément de plancher mensuel (€) d'un ménage type au coût employeur `c` : plancher du ménage − revenu sans activité, retiré à raison de α du gain de revenu d'activité (net + prime) ; 'sec' : tout ou rien. */
  function complementPlancher(a, t, c, p) {
    p = p || P1C(a);
    var T = TYPES_MENAGE[t], b0 = revenuBase(a, p, t, 0), c0 = Math.max(0, T.garantie - b0);
    if (!(c0 > 0)) return 0;
    if (c <= 0) return c0;
    var al = alphaSortie(a);
    if (al === null) return 0;
    if (a.seuilHeures > 0 && 35 * C.brutDeCout(c) / SMIC < a.seuilHeures) al = 1;   // H596 : sous le seuil d'heures, le complément est maintenu (le gain d'activité ne le réduit pas ET ne s'y ajoute pas)
    return Math.max(0, c0 - al * (revenuBase(a, p, t, c) - b0));
  }
  /** Revenu disponible mensuel du ménage type (€) au coût employeur c, complément de plancher compris. */
  function revenuMenage(a, t, c, p) { p = p || P1C(a); return revenuBase(a, p, t, c) + complementPlancher(a, t, c, p); }
  /**
   * Courbe d'incitation d'un ménage type, de 0 à 2 Smic (H564) : TME = taux marginal effectif sur +1 % de salaire (part du coût employeur perdue), TP = taux de participation
   * (part du coût employeur perdue en passant de 0 à x Smic, par rapport au revenu SANS activité, plancher compris) ; `actuel` : droit actuel (atlas OpenFisca 2026, revenu disponible étendu).
   */
  function courbeTME(a, t, xs) {
    a = archi(a); var p = P1C(a), T = TYPES_MENAGE[t], r0 = revenuMenage(a, t, 0, p), av0 = GP.atlas(T.atlas, 0, 6);
    return (xs || [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]).map(function (x) {
      var c = C.coutDeBrut(x * SMIC), c1 = C.coutDeBrut(x * SMIC * 1.01), b = x * SMIC, b1 = x * SMIC * 1.01;
      var r = revenuMenage(a, t, c, p), r1 = revenuMenage(a, t, c1, p), av = GP.atlas(T.atlas, b, 6), av1 = GP.atlas(T.atlas, b1, 6);
      return { x: x, cout: c, revenu: r, actuel: av, tme: 1 - (r1 - r) / (c1 - c), tmeActuel: 1 - (av1 - av) / (c1 - c), tp: 1 - (r - r0) / c, tpActuel: 1 - (av - av0) / c };
    });
  }
  /** TME maximal (et salaire où il est atteint) sur 0,02 à 2 Smic au pas de 0,02, hors le zéro exact ; système proposé et droit actuel. */
  function tmeMax(a, t) {
    var xs = [], x; for (x = 0.02; x <= 2.0001; x += 0.02) xs.push(Math.round(x * 100) / 100);
    var cv = courbeTME(a, t, xs), m = { tme: -9, x: 0, actuel: -9, xActuel: 0 };
    cv.forEach(function (k) { if (k.tme > m.tme) { m.tme = k.tme; m.x = k.x; } if (k.tmeActuel > m.actuel) { m.actuel = k.tmeActuel; m.xActuel = k.x; } });
    return m;
  }
  /**
   * Effet de la sortie du plancher sur la participation (H567) : variation relative de l'emploi du ménage type à x Smic, η × ln(r / r_réf), r = part du coût employeur conservée (1 − TP, bornée
   * à 5 % : à moins, le travail ne paie plus) ; η = 0,4 (profil D1-D2, offre-de-travail/modele.js) × facteur du scénario. Référence : la falaise 'sec' ou le droit actuel.
   */
  function participation(a, t, xs, sc) {
    a = archi(a); sc = sc || 'central';
    var cv = courbeTME(a, t, xs), cs = courbeTME(F(a, { sortiePlancher: 'sec' }), t, xs), eta = ETA_PARTICIPATION * FACTEUR_PARTICIPATION[sc];
    var r = function (tp) { return Math.max(0.05, 1 - tp); };
    return cv.map(function (k, i) { return { x: k.x, tp: k.tp, tpSec: cs[i].tp, tpActuel: k.tpActuel, versSec: eta * Math.log(r(k.tp) / r(cs[i].tp)), versActuel: eta * Math.log(r(k.tp) / r(k.tpActuel)) }; });
  }
  var _pl = {}, _d0 = {};
  /**
   * Masse annuelle (€) du complément de plancher par dixième, adultes non retraités hors bénéficiaires du plancher (quadrature de palier1.deciles à la dispersion `disp`) : complément de la
   * PERSONNE SEULE (seul type calculable par adulte, H565), multiplié par k = dépense observée de la prime d'activité (10,65 Md€) / même somme calculée par adulte avec l'atlas : k ≈ 0,21
   * corrige l'oubli du ménage (conjoint avec revenu), du non-recours et des plafonds de ressources (H566 ⚠️ V8201). Les 1,84 M de bénéficiaires à zéro revenu sont déjà dans le solde de base.
   */
  function massesPlancher(a, disp) {
    var al = alphaSortie(a); if (al === null) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var k = [a.tPlat, a.socle, a.sortiePlancher, al, a.seuilHeures, a.ppaMaintenue, a.abattementActivite, a.bonusActivite, a.bonusFin, disp].join('|'); if (_pl[k]) return _pl[k];
    var d0 = _d0[disp] || (_d0[disp] = GP.deciles(versOF(archi({})), undefined, { dispersion: disp })), p = P1C(a), out = [], d, g, ppaMod = 0;
    for (d = 0; d < 10; d++) {
      var x = d0.deciles[d], nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), m = 0;
      for (g = 0; g < 5; g++) {
        var c = x.detail.Rpers * Math.exp(disp * C_GH.z[g] - disp * disp / 2) / 12;
        m += C_GH.w[g] * complementPlancher(a, 'seul', c, p) * 12 * nb;
        ppaMod += C_GH.w[g] * GP.atlas('celib_locataire_z2', C.brutDeCout(c), 2) * 12 * nb;
      }
      out.push(m);
    }
    var kc = PPA_MD * 1e9 / ppaMod;
    return (_pl[k] = out.map(function (m) { return m * kc; }));
  }
  /** Coût (Md€/an) du complément de plancher au scénario sc : dispersions 0,3 / 0,6 / 0,9 (bas = la moins coûteuse, haut = la plus coûteuse, comme le bonus). */
  function coutPlancher(a, sc) {
    if (alphaSortie(a) === null) return 0;
    var v = SCS.map(function (s) { return sommeMd(massesPlancher(a, DISP[s])); });
    return sc === 'bas' ? Math.min.apply(null, v) : sc === 'haut' ? Math.max.apply(null, v) : v[1];
  }
  /**
   * Choix de la sortie (H569, tranché par Claude le 03/11) parmi maintien / dégressif / plat : (i) le travail à très temps partiel paie (TP de la personne seule à 0,25 Smic ≤ 50 %), (ii) aucun TME
   * au-dessus de 80 % entre 0 et 2 Smic pour la personne seule, le parent isolé et le couple (le droit actuel monte à 131 % vers 0,4 Smic), puis le moins coûteux au central, puis le moins de paramètres.
   */
  function choisirSortie(a) {
    var cand = ['maintien', 'degressif', 'plat'].map(function (v) {
      var b = F(archi(a), { sortiePlancher: v }), tp = courbeTME(b, 'seul', [0.25])[0].tp, mx = Math.max(tmeMax(b, 'seul').tme, tmeMax(b, 'parent').tme, tmeMax(b, 'couple').tme);
      return { v: v, tp25: tp, tmeMax: mx, cout: coutPlancher(b, 'central'), params: complexite(b).parametresProtection, ok: tp <= 0.5 && mx <= 0.8 };
    }).filter(function (x) { return x.ok; });
    cand.sort(function (x, y) { return (x.cout - y.cout) || (x.params - y.params); });
    return cand.length ? cand[0].v : null;
  }
  var SORTIE_TRANCHEE = 'plat';   // résultat de choisirSortie(architecture finale), vérifié par test_optimum.js
  /** Balayage de α (H568) : coût central, TME maximal (personne seule), TME à 0,25 / 0,5 / 1 Smic, TP à 0,25 / 0,5. */
  function balayageAlpha(a, alphas) {
    return alphas.map(function (al) {
      var b = F(archi(a), { sortiePlancher: 'alpha', alphaPlancher: al }), cv = courbeTME(b, 'seul', [0.25, 0.5, 1]), m = tmeMax(b, 'seul');
      return { alpha: al, cout: coutPlancher(b, 'central'), tmeMax: m.tme, xTmeMax: m.x, tme: cv.map(function (k) { return k.tme; }), tp: cv.map(function (k) { return k.tp; }) };
    });
  }
  var _abt = {};
  /** Levier 1 : masse annuelle (€) de l'abattement par dixième, pour une dispersion donnée (adultes non retraités hors plancher, quadrature de palier1.deciles ; part d'activité du revenu, H550). */
  function massesAbattement(A, t, disp) {
    var k = A + '|' + t + '|' + disp; if (_abt[k]) return _abt[k];
    var d0 = GP.deciles(versOF(archi({})), undefined, { dispersion: disp }), DI = G.DINA, out = [], d, g;
    for (d = 0; d < 10; d++) {
      var x = d0.deciles[d], nb = x.nonRetraitesM * 1e6 * (1 - x.partSousPlancher), act = (DI.salairesSuperBruts[d] + DI.revenusMixtes[d]) / (DI.salairesSuperBruts[d] + DI.revenusMixtes[d] + DI.revenusFinanciers[d]), m = 0;
      for (g = 0; g < 5; g++) m += C_GH.w[g] * t * Math.min(act * x.detail.Rpers * Math.exp(disp * C_GH.z[g] - disp * disp / 2), 12 * A);
      out.push(m * nb);
    }
    return (_abt[k] = out);
  }
  var C_GH = { z: [-2.857, -1.3556, 0, 1.3556, 2.857], w: [0.01126, 0.22207, 0.53333, 0.22207, 0.01126] };
  var _bon = {};
  /** Levier 2 : masse annuelle (€) du bonus par dixième (correctifs.massesDeciles), mise en cache. */
  function massesBonus(B, fin, sc) {
    var k = B + '|' + fin + '|' + sc; if (_bon[k]) return _bon[k];
    return (_bon[k] = C.massesDeciles(versOF(archi({})), undefined, sc, B, fin).map(function (x) { return x.bonusAn; }));
  }
  function sommeMd(t) { return t.reduce(function (s, x) { return s + x; }, 0) / 1e9; }
  /** Clé de répartition de la prime d'activité maintenue sur les dixièmes : celle d'un bonus individuel de même forme (extinction à 1,6 Smic), H554 ⚠️. */
  function clePPA() { var m = massesBonus(100, 1.6, 'central'), s = m.reduce(function (u, x) { return u + x; }, 0); return m.map(function (x) { return x / s; }); }
  /**
   * Coût des leviers de protection (Md€/an) au scénario `sc` (H552) : abattement et bonus aux dispersions 0,3 / 0,6 / 0,9 (bas = la moins coûteuse, haut = la plus coûteuse,
   * comme correctifs.coutC) ; prime d'activité : part maintenue × 10,65 Md€ (dépense observée, non-recours compris), identique aux trois scénarios.
   */
  function coutProtection(a, sc) {
    var ab = 0, bo = 0, pp = 0, pl = coutPlancher(a, sc);
    if (a.abattementActivite > 0) {
      var v = SCS.map(function (s) { return sommeMd(massesAbattement(a.abattementActivite, a.tPlat, DISP[s])); });
      ab = sc === 'bas' ? Math.min.apply(null, v) : sc === 'haut' ? Math.max.apply(null, v) : v[1];
    }
    if (a.bonusActivite > 0) {
      var w = SCS.map(function (s) { return sommeMd(massesBonus(a.bonusActivite, a.bonusFin, s)); });
      bo = sc === 'bas' ? Math.min.apply(null, w) : sc === 'haut' ? Math.max.apply(null, w) : w[1];
    }
    if (a.ppaMaintenue > 0) pp = a.ppaMaintenue * PPA_MD;
    return { abattement: ab, bonus: bo, ppa: pp, plancher: pl, total: ab + bo + pp + pl };
  }
  /** Gain par dixième (€/UC/mois, central) des leviers de protection. */
  function protectionDeciles(a) {
    var uc = G.ucParDecile(), out = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], d;
    if (!(a.abattementActivite > 0 || a.bonusActivite > 0 || a.ppaMaintenue > 0 || alphaSortie(a) !== null)) return out;
    var mA = a.abattementActivite > 0 ? massesAbattement(a.abattementActivite, a.tPlat, DISP.central) : null, mB = a.bonusActivite > 0 ? massesBonus(a.bonusActivite, a.bonusFin, 'central') : null, kP = a.ppaMaintenue > 0 ? clePPA() : null, mP = alphaSortie(a) !== null ? massesPlancher(a, DISP.central) : null;
    for (d = 0; d < 10; d++) {
      var ucd = uc[d] * 1e6 * 12;
      out[d] = ((mA ? mA[d] : 0) + (mB ? mB[d] : 0) + (kP ? a.ppaMaintenue * PPA_MD * 1e9 * kP[d] : 0) + (mP ? mP[d] : 0)) / ucd;
    }
    return out;
  }
  /**
   * Clé « cas » de la majoration parent isolé (H556) : 70 % des familles monoparentales au travail (correctifs H456), placées au dixième du parent isolé au Smic,
   * 30 % sans emploi, au dixième du parent isolé au RSA majoré ; dixième = celui dont le niveau de vie moyen (DINA) est le plus proche du niveau de vie du cas (revenu actuel / 1,6 UC).
   */
  var _cc = null;
  function cleCas() {
    if (_cc) return _cc;
    var uc = G.ucParDecile(), r = G.DINA.rdb, k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], pe = C.HYP.parentsEmploi;
    function dix(nvAn) { var b = 0, i; for (i = 1; i < 10; i++) if (Math.abs(r[i] - nvAn) < Math.abs(r[b] - nvAn)) b = i; return b; }
    var avant = {}; GP.casTypes(versOF(archi({}))).forEach(function (c) { avant[c.id] = c.avantMois; });
    k[dix(avant.parent_isole_smic * 12 / 1.6)] += pe; k[dix(avant.parent_isole_sans_emploi * 12 / 1.6)] += 1 - pe;
    _cc = k.map(function (x, i) { return x / (uc[i] * 1e6 * 12); }); return _cc;
  }
  /**
   * Incitation au travail d'un adulte seul sans enfant, locataire (H558) : taux marginal effectif sur +1 % de salaire et taux de participation (part du coût employeur
   * perdue en passant de 0 à x Smic), système proposé avec leviers contre droit actuel (atlas OpenFisca 2026, revenu disponible étendu). Plancher : 877 € sans revenu (palier 1).
   */
  function incitations(a, xs) {
    a = archi(a);
    var p = P1C(a), out = [];
    function apres(c) { var b = C.brutDeCout(c); return C.apresSeul(p, c, 0) + gainIndividuel(a, c) + (a.ppaMaintenue > 0 ? a.ppaMaintenue * GP.atlas('celib_locataire_z2', b, 2) : 0); }
    function avant(c) { return GP.atlas('celib_locataire_z2', C.brutDeCout(c), 6); }
    var ap0 = Math.max(D.rsa.niveau, a.socle), av0 = GP.atlas('celib_locataire_z2', 0, 6);   // sans revenu : plancher RSA (877 €) ou socle s'il est plus haut
    (xs || [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]).forEach(function (x) {
      var c0 = C.coutDeBrut(x * SMIC), c1 = C.coutDeBrut(x * SMIC * 1.01);
      out.push({ x: x, cout: c0, apres: apres(c0), avant: avant(c0), tmeApres: 1 - (apres(c1) - apres(c0)) / (c1 - c0), tmeAvant: 1 - (avant(c1) - avant(c0)) / (c1 - c0),
                 tpApres: 1 - (Math.max(apres(c0), D.rsa.niveau) - ap0) / c0, tpAvant: 1 - (avant(c0) - av0) / c0 });
    });
    return out;
  }
  function P1C(a) { return GP.config(versOF(a)).p; }

  // ---------- Affinage : recherche ciblée autour de la recommandation (H550, H559)
  /** Recommandation du chantier 2 (avec le paquet du chantier 4), plus les titres non cotés taxés à la vente (ajoutés par défaut, 03/11). */
  var RECOMMANDATION = { tPlat: 0.40, socle: 350, taxe: { assiette: 'pierre', abattement: 0, plafond: 0.05, nonCotesVente: true }, tHeritage: 0.5, exceptionConjoint: true, report150: true,
                         economies: 'e2e4', structurelles: 'A', nichesTVA: true, education: 'tuteurRedeploye', majParentIsole: 500, alRetraites: true, capitalDepart: true, exemptionVie: 100000 };
  var CAS_PROTEGES_AFFINAGE = ['parent_isole_smic', 'retraite_aspa_loc', 'smic_seul', 'couple_1smic_2enf'];
  var LEVIERS = (function () {
    var l = [{ nom: 'aucun' }];
    [100, 200, 300, 400, 500, 600].forEach(function (A) { l.push({ nom: 'abattement', abattementActivite: A }); });
    [100, 150, 200, 250, 300].forEach(function (B) { [1.3, 1.6].forEach(function (f) { l.push({ nom: 'bonus', bonusActivite: B, bonusFin: f }); }); });
    [0.25, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1].forEach(function (k) { l.push({ nom: 'ppa', ppaMaintenue: k }); });
    return l;
  })();
  var GRILLE_AFFINAGE = {
    tPlat: (function () { var t = [], x; for (x = 360; x <= 450; x += 5) t.push(x / 1000); return t; })(),
    socle: [350, 375, 400, 425, 450, 500, 550, 600],
    majParentIsole: [200.78, 250, 300, 400, 500],
    levier: LEVIERS
  };
  function sansLibelle(l) { var o = {}, k; for (k in l) if (k !== 'nom') o[k] = l[k]; return o; }
  /**
   * Préférence de l'affinage : contraintes (1), (3) élargie, (4), (5), (6) dans l'ordre (la (2) est relâchée, comme dans la recommandation), puis taux plat le plus bas,
   * puis le moins de règles et d'exceptions, puis le moins de paramètres de protection, puis le socle le plus haut, puis le meilleur solde au haut.
   */
  function prefAffinage(x, y) {
    var X = { contraintes: x.contraintes.slice(), violations: x.violations }, Y = { contraintes: y.contraintes.slice(), violations: y.violations };
    X.contraintes[1] = Y.contraintes[1] = true;
    var c = cmpViolations(X, Y); if (c) return c > 0;
    if (Math.abs(x.a.tPlat - y.a.tPlat) > 1e-9) return x.a.tPlat < y.a.tPlat;
    if (x.complexite.total !== y.complexite.total) return x.complexite.total < y.complexite.total;
    if (x.complexite.parametresProtection !== y.complexite.parametresProtection) return x.complexite.parametresProtection < y.complexite.parametresProtection;
    if (x.a.socle !== y.a.socle) return x.a.socle > y.a.socle;
    return x.soldes.haut > y.soldes.haut;
  }
  /** Recherche ciblée : base (défaut : RECOMMANDATION) × taux × socle × majoration × levier de protection ; `filtre(levier)` restreint les leviers. */
  function affiner(o) {
    o = o || {};
    var base = F(RECOMMANDATION, o.base || {}), g = F(GRILLE_AFFINAGE, o.grille || {}), liste = o.casProteges || CAS_PROTEGES_AFFINAGE, pref = o.pref || prefAffinage, best = null, n = 0;
    g.levier.forEach(function (l) {
      if (o.filtre && !o.filtre(l)) return;
      g.tPlat.forEach(function (t) { g.socle.forEach(function (s) { g.majParentIsole.forEach(function (mj) {
        var e = evaluer(F(base, F(sansLibelle(l), { tPlat: t, socle: s, majParentIsole: mj })), liste); n++;
        if (!best || pref(e, best)) best = e;
      }); }); });
    });
    return { meilleur: best, evalues: n };
  }

  // ---------- Règle de stabilisation automatique (H560)
  /**
   * Chaque année, si le solde constaté s'écarte de la cible de plus de X Md€, le taux plat bouge de ± `pas` (0,5 point) l'année suivante, dans une marge de ± `marge`
   * (2 points) autour du taux voté ; variante : le socle bouge de ∓ `pasSocle` € dans une marge de ± `margeSocle` €. Croisière statique : le scénario est supposé réalisé dès l'an 1.
   */
  function stabilisateur(a, sc, o) {
    o = F({ X: 15, pas: 0.005, marge: 0.02, annees: 10, levier: 'taux', pasSocle: 25, margeSocle: 100, cible: 0 }, o || {});
    a = archi(a);
    var t0 = a.tPlat, s0 = a.socle, t = t0, so = s0, traj = [], y;
    for (y = 1; y <= o.annees; y++) {
      var b = F(a, { tPlat: Math.round(t * 1000) / 1000, socle: so }), v = solde(b, sc);
      traj.push({ annee: y, tPlat: b.tPlat, socle: so, solde: v });
      var sens = v < o.cible - o.X ? 1 : v > o.cible + o.X ? -1 : 0;
      if (o.levier !== 'socle') t = Math.max(t0 - o.marge, Math.min(t0 + o.marge, t + sens * o.pas));
      if (o.levier !== 'taux') so = Math.max(s0 - o.margeSocle, Math.min(s0 + o.margeSocle, so - sens * o.pasSocle));
    }
    var f = traj[traj.length - 1], bf = F(a, { tPlat: f.tPlat, socle: f.socle });
    return { trajectoire: traj, final: f, gain: f.solde - traj[0].solde, casFinal: casTypes(bf), decilesFinal: deciles(bf), margMaxFinal: P1.marginalMax(OF.stOption(OF.opt(versOF(bf)))).personnel };
  }

  // ---------- Pression fiscale nette du socle (H557)
  /**
   * Décomposition de la variation des prélèvements nets du socle (Md€, identité comptable) : deltaNet = (solde − déficit actuel) + dépenses nettes nouvelles hors socle
   * (correctifs, capital de départ, protection, assurance chômage conservée, éducation… moins les économies), ce dernier terme étant le résidu.
   */
  function pressionNette(a, sc) {
    a = archi(a); sc = sc || 'central';
    var p = prelevements(a, sc), so = solde(a, sc), comble = so - D.deficitActuel;
    return { deltaNet: p.deltaNet, partPIB: p.deltaNet / PIB, poPartPIB: p.partPIB, deficitComble: comble, depensesNettes: p.deltaNet - comble, solde: so, prelevements: p };
  }

  // ---------- Contraintes
  var NOMS = ['(1) solde ≥ 0 au central', '(2) solde ≥ −3 % du PIB au haut', '(3) D1-D3, parent isolé au Smic et retraité locataire non perdants',
              '(4) plafond de 50 % sur les transmissions', '(5) taux marginal à l\'infini ≤ 75 %', '(6) taxe à 1 % : effort ≤ 10 % du revenu (retraité propriétaire modeste)'];
  /** `liste` (affinage, H550) : cas types qui ne doivent pas perdre dans la contrainte (3) ; défaut : parent isolé au Smic et retraité locataire. */
  function evaluer(a, liste) {
    a = archi(a);
    var s = soldes(a), d = deciles(a), ct = casTypes(a), mm = P1.marginalMax(OF.stOption(OF.opt(versOF(a)))).personnel, ef = effort(HYP.retraiteModeste, a);
    var v3 = violation3(d, ct, liste), c3 = v3 <= 0;
    var c = [s.central >= 0, s.haut >= SEUIL_HAUT, c3, tauxTransmissionMax(a) <= 0.5 + 1e-9, mm <= HYP.margMax, ef <= HYP.effortMax + 1e-9];
    var v = [Math.max(0, -s.central), Math.max(0, SEUIL_HAUT - s.haut), v3, Math.max(0, tauxTransmissionMax(a) - 0.5), Math.max(0, mm - 0.75), Math.max(0, ef - HYP.effortMax)];
    return { a: a, soldes: s, contraintes: c, violations: v, deciles: d, cas: ct, margMax: mm, effort: ef, complexite: complexite(a) };
  }

  // ---------- Simplicité : règles et exceptions (demande de l'auteur, 03/11, 15 h 3x ; H545)
  /**
   * Compte des règles (paramètres qu'un citoyen doit connaître) et des exceptions (dérogations à une règle générale). Règles de base : taux plat, socle, impôt sur les
   * transmissions, décès = vente, taxe à 1 % ; exceptions : conjoint, imputation au décès, résidence principale exonérée de plus-value (décision), abattement, déduction des dettes,
   * plafonnement au revenu, non-cotés à la vente, majoration parent isolé, aide au logement des retraités. La fin d'une niche (report 150-0 B ter, CIR) retire une exception.
   */
  function complexite(a) {
    a = archi(a);
    var regles = 4 + (a.taxe ? 1 : 0) + (a.capitalDepart ? 1 : 0), exc = [];
    if (a.exemptionVie) exc.push('exemption de ' + a.exemptionVie + ' € par héritier (reçu à vie)');
    if (a.heritageFonction) exc.push('impôt sur l\'héritage reçu à vie : fonction lisse du cumul reçu, un paramètre K, aucun seuil');
    exc.push('résidence principale exonérée de plus-value');
    exc.push('imputation de l\'impôt sur le gain au décès sur les droits (plafond de 50 %)');
    if (a.exceptionConjoint) exc.push('conjoint survivant exonéré');
    if (a.taxe && a.taxe.abattement) exc.push('abattement de ' + a.taxe.abattement + ' € sur la taxe à 1 %');
    if (a.taxe && a.taxe.assiette === 'pierreNet') exc.push('dettes déduites de la taxe à 1 %');
    if (a.taxe && a.taxe.plafond) exc.push('plafonnement de la taxe à ' + Math.round(a.taxe.plafond * 100) + ' % du revenu (différé)');
    if (a.taxe && a.taxe.nonCotesVente) exc.push('titres non cotés taxés à la vente');
    if (a.majParentIsole > 0) exc.push('majoration parent isolé');
    if (a.alRetraites) exc.push('aide au logement des retraités locataires');
    // affinage (H555) : chaque levier de protection compte pour une exception ; `parametres` dit combien de paramètres il ajoute
    var par = 0;
    if (a.abattementActivite > 0) { exc.push('abattement de ' + a.abattementActivite + ' € sur les premiers revenus d\'activité'); par += 1; }
    if (a.bonusActivite > 0) { exc.push('bonus d\'activité de ' + a.bonusActivite + ' € (extinction à ' + String(a.bonusFin).replace('.', ',') + ' Smic)'); par += 3; }
    if (a.ppaMaintenue > 0) { exc.push('prime d\'activité maintenue à ' + Math.round(a.ppaMaintenue * 100) + ' %'); par += PPA_PARAMETRES; }
    if (alphaSortie(a) !== null) { exc.push('sortie du plancher : complément retiré à raison de ' + (a.sortiePlancher === 'maintien' ? '100 % (minimum garanti)' : a.sortiePlancher === 'plat' ? 'taux plat' : Math.round(alphaSortie(a) * 100) + ' %') + ' du revenu d\'activité net et de la prime'); par += (a.sortiePlancher === 'maintien' || a.sortiePlancher === 'plat') ? 0 : 1; }
    var niches = 3;   // report 150-0 B ter, CIR, niches de TVA et d'accises existent par défaut
    if (a.report150) niches--;
    if (a.nichesTVA) niches--;
    if (a.economies === 'e2e4') niches--;
    if (a.economies === 'e2e3') exc.push('CIR réservé aux PME et ETI');
    return { regles: regles, exceptions: exc.length + niches, liste: exc, niches: niches, total: regles + exc.length + niches, parametresProtection: par };
  }

  // ---------- Recherche
  var GRILLE = {
    tPlat: (function () { var t = [], x; for (x = 350; x <= 450; x += 5) t.push(x / 1000); return t; })(),
    socle: [350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600],
    taxe: (function () {
      var t = [null];
      ['pierre', 'pierreNet'].forEach(function (as) { [0, 100000].forEach(function (ab) { [null, 0.05, 0.10, 0.15].forEach(function (pl) { [false, true].forEach(function (nc) {
        t.push({ assiette: as, abattement: ab, plafond: pl, nonCotesVente: nc }); }); }); }); });
      return t;
    })(),
    tHeritage: [0.5, 0.45, 0.4],
    report150: [false, true],
    economies: ['aucune', 'e1', 'e2', 'e2e3', 'e2e4'],
    majParentIsole: [200.78, 250, 300, 350, 400, 500],
    nichesTVA: [false, true]
    // éducation : fixée au défaut tranché (redéploiement vers le tuteur, Q10) ; l'écart avec la variante « économie » est affiché à part
  };
  /** Ampleur de la violation de la contrainte (3), € par mois : la plus grande perte parmi D1-D3 (par UC), le parent isolé au Smic et le retraité locataire (par ménage). */
  var CAS_PROTEGES = ['parent_isole_smic', 'retraite_aspa_loc'];
  function violation3(d, ct, liste) {
    var v = Math.max(0, -d[0].ecart, -d[1].ecart, -d[2].ecart);
    (liste || CAS_PROTEGES).forEach(function (id) { v = Math.max(v, -ct[id].ecartMois); });
    return v;
  }
  /** Comparaison lexicographique des contraintes (dans l'ordre de priorité) : > 0 si x est meilleur que y. */
  function cmpContraintes(x, y) { for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] ? 1 : -1; return 0; }
  /** Tolérances de comparaison des violations (H544) : deux violations plus proches que cela sont jugées équivalentes. */
  var TOL_VIOL = [1, 1, 5, 0.001, 0.001, 0.001];
  /**
   * Comparaison « au mieux » : dans l'ordre de priorité, une contrainte tenue l'emporte ; si les deux architectures la violent, la plus petite violation l'emporte
   * (au-delà de la tolérance), sinon on passe à la contrainte suivante. > 0 si x est meilleur.
   */
  function cmpViolations(x, y) {
    for (var i = 0; i < x.contraintes.length; i++) {
      if (x.contraintes[i] !== y.contraintes[i]) return x.contraintes[i] ? 1 : -1;
      if (!x.contraintes[i] && Math.abs(x.violations[i] - y.violations[i]) > TOL_VIOL[i]) return x.violations[i] < y.violations[i] ? 1 : -1;
    }
    return 0;
  }
  /**
   * Ordre de préférence par défaut : contraintes (lexicographique), puis taux plat le plus bas, puis socle le plus haut, puis le moins de règles et d'exceptions
   * (simplicité, demande de l'auteur), puis le meilleur solde au haut (robustesse).
   */
  function meilleur(x, y) {
    var c = x.violations && y.violations ? cmpViolations(x, y) : cmpContraintes(x.contraintes, y.contraintes); if (c) return c > 0;
    if (Math.abs(x.a.tPlat - y.a.tPlat) > 1e-9) return x.a.tPlat < y.a.tPlat;
    if (x.a.socle !== y.a.socle) return x.a.socle > y.a.socle;
    if (x.complexite.total !== y.complexite.total) return x.complexite.total < y.complexite.total;
    return x.soldes.haut > y.soldes.haut;
  }
  /**
   * Parcours complet de la grille. Évaluation rapide en deux temps : les postes additifs du solde sont mis en cache ; les contraintes coûteuses (dixièmes, cas types)
   * ne dépendent que de (taux, socle, taxe, majoration). `filtre(a)` restreint la grille ; `pref(x, y)` remplace l'ordre de préférence ; `garder` : nombre de candidats conservés.
   */
  function rechercher(o) {
    o = o || {};
    var g = F(GRILLE, o.grille || {}), pref = o.pref || meilleur, best = null, n = 0, nFaisables = [0, 0, 0, 0, 0, 0, 0], fixe = o.fixe || {};
    g.tPlat.forEach(function (t) { g.socle.forEach(function (s) { g.taxe.forEach(function (tx) { g.majParentIsole.forEach(function (mj) {
      // contraintes (3), (5), (6) : ne dépendent que du taux, du socle, de la taxe et de la majoration
      var a0 = archi(F(fixe, { tPlat: t, socle: s, taxe: tx, majParentIsole: mj })), d = deciles(a0), ct = casTypes(a0);
      var v3 = violation3(d, ct, o.casProteges), c3 = v3 <= 0;
      var mm0 = P1.marginalMax(OF.stOption(OF.opt(versOF(a0)))).personnel, ef0 = effort(HYP.retraiteModeste, a0), c5 = mm0 <= HYP.margMax, c6 = ef0 <= HYP.effortMax + 1e-9;
      var v5 = Math.max(0, mm0 - 0.75), v6 = Math.max(0, ef0 - HYP.effortMax);
      g.tHeritage.forEach(function (h) { g.report150.forEach(function (rp) { g.economies.forEach(function (e) {
        (g.nichesTVA || [!!fixe.nichesTVA]).forEach(function (tva) { (g.education || [fixe.education || DEFAUT.education]).forEach(function (edu) {
          var a = archi(F(a0, { tHeritage: h, report150: rp, economies: e, nichesTVA: tva, education: edu }));
          if (o.filtre && !o.filtre(a)) return;
          var so = soldes(a), r = { a: a, soldes: so, contraintes: [so.central >= 0, so.haut >= SEUIL_HAUT, c3, tauxTransmissionMax(a) <= 0.5 + 1e-9, c5, c6], complexite: complexite(a) };
          r.violations = [Math.max(0, -so.central), Math.max(0, SEUIL_HAUT - so.haut), v3, Math.max(0, tauxTransmissionMax(a) - 0.5), v5, v6];
          n++; var k = 0; while (k < 6 && r.contraintes[k]) k++; nFaisables[k]++;
          if (!best || pref(r, best)) best = r;
        }); });
      }); }); });
    }); }); }); });
    return { meilleur: best ? evaluer(best.a) : null, evalues: n, prefixeTenu: nFaisables };
  }

  /** Montée du socle (transition, année n) : solde de l'année n avec un socle linéaire de `depart` à socle final sur `annees`, et la taxe en trésorerie (créances non échues). */
  function transition(a, n, annees, depart) {
    a = archi(a);
    var socleN = depart + (a.socle - depart) * Math.min(1, Math.max(0, (n - 1) / (annees - 1))), b = F(a, { socle: socleN }), r = {};
    SCS.forEach(function (sc) {
      var d = detail(b, sc), tx = d.taxeDetail;
      r[sc] = d.total - tx.nette + (n <= HYP.dureeCreance ? tx.tresorerieAn1 : tx.nette);
    });
    return { socle: socleN, soldes: r, deciles: deciles(b), cas: casTypes(b) };
  }

  /** Sensibilités du solde central (Md€) à quelques paramètres fragiles, pour classer les trois plus fragiles (H547). */
  function sensibilites(a) { a = archi(a); return avecExil(a.exil, function () { return sensibilitesBrut(a); }); }
  function sensibilitesBrut(a) {
    var c0 = solde(a, 'central'), out = [];
    function push(nom, v) { out.push({ nom: nom, delta: v }); }
    push('héritage : écart de déclaration de 40 % (au lieu de ' + Math.round(M.SCENARIOS.central.fuiteTransm * 100) + ' %)', droits0('central', a, 0.40 - M.SCENARIOS.central.fuiteTransm));
    push('réactions de comportement du scénario haut (taux plat, socle), le reste au central', P1.solde(OF.stOption(OF.opt(versOF(a))), 'haut') - P1.solde(OF.stOption(OF.opt(versOF(a))), 'central'));
    if (a.taxe) push('taxe à 1 % : hypothèses du module les moins favorables (érosion, capitalisation, valorisation)', taxe('haut', a).nette - taxe('central', a).nette   /* palier haut = module bas (le moins favorable) */);
    push('exception du conjoint : part de 25 % (au lieu de 18 %)', -(0.25 - 0.18) * droits('central', a.tHeritage));
    push('économies de dépenses : aucune réalisée', -OF.economies(OF.opt(versOF(a)), 'central'));
    push('réforme immobilière : hypothèses les moins favorables', OF.immobilier(OF.opt(versOF(a)), 'haut') - OF.immobilier(OF.opt(versOF(a)), 'central'));
    out.sort(function (x, y) { return Math.abs(y.delta) - Math.abs(x.delta); });
    return { central: c0, liste: out };
  }
  function droits0(sc, a, ajout) { return OF.transmissionsMd(sc, { t: a.tHeritage, ajout: ajout }) - OF.transmissionsMd(sc, { t: a.tHeritage, ajout: 0 }); }

  // ---------- Architecture finale v2 (03/11, H571-H580) : sortie « plat » active, fourchettes d'exil défendables, recherche ciblée refaite
  /** Architecture finale du § 7.3 (affinage), sortie 'sec', exil des modules : point de comparaison. */
  var FINALE_73 = F(RECOMMANDATION, { tPlat: 0.405, socle: 350, majParentIsole: 400, ppaMaintenue: 0.8, cleMajoration: 'cas' });
  /** Base de la recherche v2 : la recommandation, majoration sur les dixièmes des parents isolés (H556), sortie du plancher « plat » (tranchée, H569), exil « défendable » (H571-H572). */
  var BASE_V2 = { cleMajoration: 'cas', sortiePlancher: 'plat', exil: 'defendable' };
  var TOL_V2 = 0.005;   // H575 : « à solde voisin » = taux plat à moins de 0,5 point du plus bas qui tient les contraintes (≈ 5 Md€ au central)
  /** TME maximal de 0 à 2 Smic sur les trois ménages types (personne seule, parent isolé, couple à un salaire). */
  function tmeMax3(a) { a = archi(a); return Math.max(tmeMax(a, 'seul').tme, tmeMax(a, 'parent').tme, tmeMax(a, 'couple').tme); }
  function sansDeux(e) { var c = e.contraintes.slice(), v = e.violations.slice(); c[1] = true; v[1] = 0; return { contraintes: c, violations: v }; }
  /**
   * Recherche v2 (H574-H576) : base × taux × socle × majoration × levier (grille de l'affinage). Ordre : contraintes (1), (3) élargie (D1-D3, smicard, couple un Smic, parent isolé au Smic,
   * retraité locataire), (4), (5), (6), la (2) restant relâchée ; puis, parmi les architectures à moins de TOL_V2 du taux plat le plus bas (solde voisin), le moins de règles et d'exceptions, le moins de
   * paramètres de protection, le taux le plus bas, le socle le plus haut, le meilleur solde au haut. Renvoie aussi `plusBas` (préférence de l'affinage : taux d'abord) pour comparaison.
   */
  function affinerV2(o) {
    o = o || {};
    var base = F(RECOMMANDATION, F(BASE_V2, o.base || {})), g = F(GRILLE_AFFINAGE, o.grille || {}), liste = o.casProteges || CAS_PROTEGES_AFFINAGE, tous = [], n = 0;
    return avecExil(base.exil, function () {
      g.levier.forEach(function (l) {
        if (o.filtre && !o.filtre(l)) return;
        g.tPlat.forEach(function (t) { g.socle.forEach(function (s) { g.majParentIsole.forEach(function (mj) {
          tous.push(evaluer(F(base, F(sansLibelle(l), { tPlat: t, socle: s, majParentIsole: mj })), liste)); n++;
        }); }); });
      });
      var top = tous[0], plusBas = tous[0];
      tous.forEach(function (e) { if (cmpViolations(sansDeux(e), sansDeux(top)) > 0) top = e; if (prefAffinage(e, plusBas)) plusBas = e; });
      var egaux = tous.filter(function (e) { return cmpViolations(sansDeux(e), sansDeux(top)) === 0; });
      if (o.tmeMax) egaux = egaux.filter(function (e) { e.tmeMax3 = tmeMax3(e.a); return e.tmeMax3 <= o.tmeMax + 1e-9; });   // H577 : critère (ii) de la sortie (H569) imposé à l'architecture
      if (!egaux.length) return { meilleur: null, plusBas: plusBas, tMin: null, voisins: [], faisables: 0, evalues: n };
      var tmin = Math.min.apply(null, egaux.map(function (e) { return e.a.tPlat; }));
      var voisins = egaux.filter(function (e) { return e.a.tPlat <= tmin + TOL_V2 + 1e-9; });
      voisins.sort(function (x, y) { return (x.complexite.total - y.complexite.total) || (x.complexite.parametresProtection - y.complexite.parametresProtection) || (x.a.tPlat - y.a.tPlat) || (y.a.socle - x.a.socle) || (y.soldes.haut - x.soldes.haut); });
      return { meilleur: voisins[0], plusBas: plusBas, tMin: tmin, voisins: voisins, faisables: egaux.length, evalues: n };
    });
  }
  /** Résultat de affinerV2() (vérifié par test_optimum.js) : l'architecture finale v2. */
  var ARCHITECTURE_V2 = F(RECOMMANDATION, F(BASE_V2, { tPlat: 0.415, socle: 350, majParentIsole: 250, ppaMaintenue: 1 }));   // v5.1 recalculée (04/11/2026, V12400-V12420) : taux d'équilibre relevé, voir resultats-optimum.txt § 18 (v2 : 41,5 % sur la grille de 0,5 point, 41,0 % avant)


  // ---------- Grille du socle (03/11, H581-H586) : « l'auteur trouve 350 € trop bas »
  /** Masse salariale (Md€/an, travail déclaré) avec les réactions d'offre de travail du modèle systeme-ideal (substitution, participation, effet revenu ; H581), au taux et au socle de `a`, scénario sc ; écart relatif D1-D9 et total contre « sans réactions » (= droit actuel). Les leviers de protection (prime d'activité…) n'entrent pas dans cette configuration : ils sont traités par `participation`. */
  function masseSalariale(a, sc) {
    a = archi(a); sc = sc || 'central';
    var p = F(P1C(a), { scenario: sc }), r = M.recettesCourants(M.param(p)), b = M.recettesCourants(M.param(F(p, { reactions: false }))), la = 0, lb = 0;
    r.parBande.forEach(function (x, i) { if (i < 9) { la += x.n * x.L; lb += b.parBande[i].n * b.parBande[i].L; } });
    return { totalMd: r.travail, sansReactionMd: b.travail, ecartTotal: r.travail / b.travail - 1, ecartD1D9: la / lb - 1 };
  }
  /** Plus petit taux plat (au dixième de point) qui donne un solde central ≥ 0, les autres paramètres de `a` fixés (dichotomie sur 30,0-60,0 % ; le solde croît avec le taux jusqu'à 60 % au moins, mais retombe vers 80 % : le taux n'est plus une ressource au-delà, H582 ; vérifié par test_optimum.js). null si même 60 % ne suffit pas. */
  function tauxEquilibre(a) {
    var lo = 300, hi = 600, f = function (k) { return solde(F(archi(a), { tPlat: k / 1000 }), 'central') >= 0; };
    if (!f(hi)) return null;
    if (f(lo)) return lo / 1000;
    while (hi - lo > 1) { var m = Math.floor((lo + hi) / 2); if (f(m)) hi = m; else lo = m; }
    return hi / 1000;
  }
  /**
   * Fiche d'une architecture pour la grille du socle : taux d'équilibre (ou taux imposé `t`), soldes b/c/h, cas types, dixièmes, contraintes, TME maximal, masse salariale, participation
   * (écart d'emploi contre le droit actuel à 0,25 / 0,5 / 1 Smic pour la personne seule, le parent isolé et le couple monoactif, η = 0,4 du profil D1-D2, H567).
   */
  function ficheSocle(a, t) {
    a = archi(a); var tt = t === undefined ? tauxEquilibre(a) : t;
    if (tt === null) return { a: a, tPlat: null };
    var b = F(a, { tPlat: tt }), e = evaluer(b), part = {};
    ['seul', 'parent', 'couple'].forEach(function (k) { part[k] = participation(b, k, [0.25, 0.5, 1], 'central').map(function (x) { return x.versActuel; }); });
    return { a: b, tPlat: tt, soldes: e.soldes, cas: e.cas, deciles: e.deciles, contraintes: e.contraintes, violations: e.violations, margMax: e.margMax, effort: e.effort, tme3: tmeMax3(b),
             masse: masseSalariale(b, 'central'), masseBas: masseSalariale(b, 'bas'), masseHaut: masseSalariale(b, 'haut'), participation: part };
  }
  /** Grille du socle : ficheSocle() pour chaque valeur de `socles`, à partir de l'architecture v2 (seuls le socle et, si `ppa` est donné, la prime d'activité changent). */
  function grilleSocle(socles, ppa) {
    return socles.map(function (s) { var o = { socle: s }; if (ppa !== undefined) o.ppaMaintenue = ppa; return ficheSocle(F(ARCHITECTURE_V2, o)); });
  }

  // ---------- Allocation unique dégressive (03/11, H590-H599) : supprimer la prime d'activité comme règle à part
  /** Architecture v2 sans prime d'activité : le complément de plancher (877 € − socle − α × revenu d'activité net) est la seule règle d'activité ; α = alpha ; seuilHeures : 0 ou 10 (H596). */
  function allocationUnique(alpha, seuilHeures) {
    return F(ARCHITECTURE_V2, { ppaMaintenue: 0, sortiePlancher: 'alpha', alphaPlancher: alpha, seuilHeures: seuilHeures || 0 });
  }
  var AU_CAS = { smic: 'smic_seul', couple: 'couple_1smic_2enf', parent: 'parent_isole_smic', rsa: 'rsa_seul' };
  /**
   * Fiche d'une variante (a, taux t ou null = taux d'équilibre) : ficheSocle + coût de la protection d'activité, règles, TME de 0 à 2 Smic, gains vs droit actuel au mi-temps
   * au Smic et à 10 h/semaine (personne seule, H597), participation à 10 h / 0,25 / 0,5 / 1 Smic, surcoût d'un recours de 100 % (H598 : dépense observée ÷ 66 %).
   */
  function ficheAllocation(a, t) {
    a = archi(a); var f = ficheSocle(a, t);
    if (f.tPlat === null) return f;
    var b = f.a, cp = coutProtection(b, 'central'), cpb = coutProtection(b, 'bas'), cph = coutProtection(b, 'haut');
    var pas = solde(F(b, { tPlat: b.tPlat + 0.01 }), 'central') - f.soldes.central;
    var pt = function (x) { var k = courbeTME(b, 'seul', [x])[0]; return { x: x, gain: k.revenu - k.actuel, tme: k.tme, tp: k.tp }; };
    var sur = (cp.ppa + cp.plancher) * (1 / 0.66 - 1);
    f.cout = { central: cp.ppa + cp.plancher, bas: cpb.ppa + cpb.plancher, haut: cph.ppa + cph.plancher, ppa: cp.ppa, plancher: cp.plancher };
    f.regles = complexite(b);
    f.courbe = courbeTME(b, 'seul', [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]);
    f.pt10h = pt(10 / 35); f.ptMiTemps = pt(0.5);
    f.part10h = participation(b, 'seul', [10 / 35], 'central')[0].versActuel;
    f.tmeMax = { seul: tmeMax(b, 'seul'), parent: tmeMax(b, 'parent'), couple: tmeMax(b, 'couple') };
    f.surcoutRecours = sur; f.tauxSupplRecours = sur / pas;
    return f;
  }

  /**
   * Allocation unique « protectrice » (H595) : la plus petite majoration parent isolé (pas de 10 €, de 250 à 600 €) pour laquelle, au taux d'équilibre de cette majoration, la contrainte (3) élargie
   * (D1-D3, smicard, couple 1 Smic, parent isolé Smic, retraité locataire) est tenue. null si aucune. Le plancher du parent isolé (1 300 €) est inchangé : seule la majoration monte.
   */
  function allocationProtegee(alpha, seuilHeures) {
    var m, a, t, e;
    for (m = 250; m <= 600; m += 10) {
      a = F(allocationUnique(alpha, seuilHeures), { majParentIsole: m }); t = tauxEquilibre(a); if (t === null) return null;
      e = evaluer(F(a, { tPlat: t }), CAS_PROTEGES_AFFINAGE); if (e.contraintes[2]) return F(a, { tPlat: t });
    }
    return null;
  }

  // ---------- Architecture v3 (03/11, H600-H609) : v2 + allocation unique dégressive (α 25 %, majoration 340 €) + socle 350 € + héritage et capital par fonctions continues (principe « pas de seuils »)
  /** Héritage reçu à vie : impôt = 50 % × x²/(x+K), K = 190 000 € (≈ 188 845 : même recette que l'exemption de 100 000 €) ; capital de départ : 40 000 € × e^(−H/K), K = 47 000 € (≈ 46 778 : même coût central que la variante C). K à confirmer par l'auteur. */
  var HERITAGE_V3 = { forme: 'hyper', K: 190000 }, CAPITAL_V3 = { forme: 'exp', K: 47000 };
  /** Architecture v3 : taux plat d'équilibre 41,1 % (vérifié par test_optimum.js : `tauxEquilibre`), plus de seuil sur l'héritage ni sur le capital. */
  var ARCHITECTURE_V3 = F(allocationUnique(0.25), { majParentIsole: 340, tPlat: 0.417, exemptionVie: 0, heritageFonction: HERITAGE_V3, capitalFonction: CAPITAL_V3 });
  // ---------- Architecture v3b (03/11, H610-H615) : v3 avec l'impôt héritage de forme E' (taux marginal 50 % × x³/(x³+K³), K = 94 000 € ≈ 93 690 : même recette que l'exemption de 100 000 €) et le capital de départ exp K = 80 000 € (pente initiale 50 %). K à confirmer par l'auteur.
  var HERITAGE_V3B = { forme: 'marg3', K: 94000 }, CAPITAL_V3B = { forme: 'exp', K: 80000 };
  /** Taux plat : taux d'équilibre central (vérifié par test_optimum.js : `tauxEquilibre`). */
  var ARCHITECTURE_V3B = F(ARCHITECTURE_V3, { tPlat: 0.420, heritageFonction: HERITAGE_V3B, capitalFonction: CAPITAL_V3B });
  // ---------- Architecture v4 (03/11, H620-H625) : décisions de l'auteur du 03/11 sur les neuf dilemmes = v3b + éducation par non-remplacement (dilemme 3) + majoration parent isolé relevée (dilemme 9)
  /** Base de la v4 : v3b avec l'éducation « non-remplacement des postes libérés », le tuteur IA compté seulement au coût de son expérimentation (H620). */
  var BASE_V4 = F(ARCHITECTURE_V3B, { education: 'nonRemplacementExperimentation' });
  var GAIN_PARENT_ISOLE_V4 = 100;   // H621 : dilemme 9, « marge plus grande » traduite en un gain d'au moins +100 €/mois pour le parent isolé au Smic (2 enfants), central
  /**
   * Plus petite majoration parent isolé (pas de `pas` €, de `min` à `max`) telle que, au taux plat d'équilibre de cette majoration, le parent isolé au Smic gagne au moins `gain` €/mois
   * et que la contrainte (3) élargie (D1-D3, smicard, couple avec un Smic, parent isolé au Smic, retraité locataire) soit tenue. Renvoie { maj, tPlat, a } ou null.
   */
  function majorationMinimale(base, gain, o) {
    o = o || {}; var pas = o.pas || 10, m, a, t, e;
    for (m = o.min || base.majParentIsole || 250; m <= (o.max || 800); m += pas) {
      a = F(base, { majParentIsole: m }); t = tauxEquilibre(a); if (t === null) return null;
      a = F(a, { tPlat: t }); e = evaluer(a, CAS_PROTEGES_AFFINAGE);
      if (e.contraintes[2] && e.cas.parent_isole_smic.ecartMois >= gain && e.cas.smic_seul.ecartMois >= 0) return { maj: m, tPlat: t, a: a };
    }
    return null;
  }
  /** Architecture v4 : majoration 390 € (plus petite au pas de 10 € qui donne +100 €/mois au parent isolé au Smic : vérifié par test_optimum.js), taux plat d'équilibre 41,0 %. */
  var ARCHITECTURE_V4 = F(BASE_V4, { majParentIsole: 390, tPlat: 0.416 });   // 04/11/2026 : taux d'équilibre recalculé 41,1 % (41,0 % avant les corrections de données V12400-V12404 : l'ancien taux laisse le central à −0,5 Md€)
  // ---------- Architecture v5 (03/11 au soir, H630-H634) : v4 + économies documentées des trois chantiers (gestion, benchmark, effectifs), sans double compte
  /** Base de la v5 : v4 (majoration 390 €) avec gestion, effectifs (central) et benchmark (classe B seulement). Le taux plat est celui de la recherche du taux d'équilibre (V5_TAUX). */
  var V5_TAUX = 0.414, V5_AMBITION_TAUX = 0.408;   // taux d'équilibre au central (recherche au dixième de point, H633)   // 04/11/2026 : V5_AMBITION_TAUX 40,2 % (40,1 % avant les corrections de données V12400-V12404, central alors à −0,3) ; V5_TAUX inchangé   // v5.1 recalculée (04/11/2026, V12400-V12411) : V5_TAUX 40,9 % (40,7 % avant), V5_AMBITION_TAUX 40,3 %
  var BASE_V5 = F(ARCHITECTURE_V4, { gestion: 'recommandee', effectifs: 'central', benchmark: 'classeB', majParentIsole: 400 });   // majoration 400 € : marge recommandée (H633)
  /** Variante « IA ambitieuse + réserves » : IA haute, informatique de l'État-plateforme, benchmark de classe C. Plafond atteignable, pas une recommandation. */
  var BASE_V5_AMBITION = F(BASE_V5, { gestion: 'avecInformatique', effectifs: 'ambitieux', benchmark: 'avecClasseC' });
  /** Architecture v5 : taux plat = taux d'équilibre central (vérifié par test_optimum.js), fixé après calcul (H633). */
  var ARCHITECTURE_V5 = F(BASE_V5, { tPlat: V5_TAUX });
  var ARCHITECTURE_V5_AMBITION = F(BASE_V5_AMBITION, { tPlat: V5_AMBITION_TAUX });
  var API = { RETRAITES_V6: RETRAITES_V6, retraitesV6Annee: retraitesV6Annee, retraitesV6Solde: retraitesV6Solde, GESTION: GESTION, EFFECTIFS_IA: EFFECTIFS_IA, BENCHMARK: BENCHMARK, gestionNette: gestionNette, BASE_V5: BASE_V5, BASE_V5_AMBITION: BASE_V5_AMBITION, ARCHITECTURE_V5: ARCHITECTURE_V5, ARCHITECTURE_V5_AMBITION: ARCHITECTURE_V5_AMBITION, DEFAUT: DEFAUT, allocationUnique: allocationUnique, allocationProtegee: allocationProtegee, ficheAllocation: ficheAllocation, CAPITAL_DEPART: CAPITAL_DEPART, PART_VIE: PART_VIE, partVie: partVie, coutCapital: coutCapital, perteExemption: perteExemption, STRUCTURELLES: STRUCTURELLES, NICHES_TVA: NICHES_TVA, EDUCATION: EDUCATION, HYP: HYP, GRILLE: GRILLE, NOMS: NOMS, SEUIL_HAUT: SEUIL_HAUT, PO_ACTUEL: PO_ACTUEL, ECO: ECO, archi: archi, versOF: versOF,
    droits: droits, decesPlafonne: decesPlafonne, coutConjoint: coutConjoint, tauxTransmissionMax: tauxTransmissionMax, revenusMenages: revenusMenages,
    patrimoineParDixieme: patrimoineParDixieme, seuilPlafond: seuilPlafond, eligible: eligible, distributionTaxe: distributionTaxe, nonCotesPartMobile: nonCotesPartMobile, taxe: taxe, effort: effort,
    coutCorrectifs: coutCorrectifs, detail: detail, solde: solde, soldes: soldes, prelevements: prelevements, deciles: deciles, casTypes: casTypes,
    evaluer: evaluer, complexite: complexite, CAS_PROTEGES: CAS_PROTEGES, CAS_PROTEGES_AFFINAGE: CAS_PROTEGES_AFFINAGE, RECOMMANDATION: RECOMMANDATION,
    LEVIERS: LEVIERS, GRILLE_AFFINAGE: GRILLE_AFFINAGE, PPA_PARAMETRES: PPA_PARAMETRES, coutProtection: coutProtection, SORTIE_TRANCHEE: SORTIE_TRANCHEE, choisirSortie: choisirSortie, SORTIES: SORTIES, TYPES_MENAGE: TYPES_MENAGE, alphaSortie: alphaSortie, revenuBase: revenuBase, complementPlancher: complementPlancher, revenuMenage: revenuMenage, courbeTME: courbeTME, tmeMax: tmeMax, participation: participation, massesPlancher: massesPlancher, coutPlancher: coutPlancher, balayageAlpha: balayageAlpha, protectionCas: protectionCas, protectionDeciles: protectionDeciles,
    EXIL: EXIL, exilVariante: exilVariante, avecExil: avecExil, FINALE_73: FINALE_73, BASE_V2: BASE_V2, TOL_V2: TOL_V2, affinerV2: affinerV2, tmeMax3: tmeMax3, ARCHITECTURE_V2: ARCHITECTURE_V2, ARCHITECTURE_V3: ARCHITECTURE_V3, HERITAGE_V3: HERITAGE_V3, CAPITAL_V3: CAPITAL_V3, ARCHITECTURE_V3B: ARCHITECTURE_V3B, HERITAGE_V3B: HERITAGE_V3B, CAPITAL_V3B: CAPITAL_V3B, BASE_V4: BASE_V4, GAIN_PARENT_ISOLE_V4: GAIN_PARENT_ISOLE_V4, majorationMinimale: majorationMinimale, ARCHITECTURE_V4: ARCHITECTURE_V4, EXPERIMENTATION_TUTEUR: EXPERIMENTATION_TUTEUR, masseSalariale: masseSalariale, tauxEquilibre: tauxEquilibre, ficheSocle: ficheSocle, grilleSocle: grilleSocle,
    gainIndividuel: gainIndividuel, cleCas: cleCas, clePF: clePF, clePPA: clePPA, incitations: incitations, prefAffinage: prefAffinage, affiner: affiner, stabilisateur: stabilisateur, pressionNette: pressionNette, cmpContraintes: cmpContraintes, cmpViolations: cmpViolations, violation3: violation3, TOL_VIOL: TOL_VIOL, meilleur: meilleur, rechercher: rechercher, transition: transition, sensibilites: sensibilites };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Optimum = API;
})(this);
