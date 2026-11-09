/*
 * modeles/etat-plateforme/modele.js
 * L'État-plateforme : coût actuel de l'informatique publique et coût cible d'une entité
 * logicielle publique unique, construite en interne avec l'IA.
 * Fonctions pures, sans dépendance. Compatible navigateur, Node et JavaScriptCore (jsc).
 *
 * Décomposition (voir methode.md, section 3) :
 *   C0 = dépense numérique publique annuelle (État et opérateurs ; sécurité sociale et
 *        France Travail ; collectivités ; hôpitaux publics), découpée en
 *        infrastructure (hébergement, réseaux, postes, télécoms), applicatif (conception,
 *        développement, maintenance, exploitation applicative) et licences/progiciels.
 *   Leviers de la cible :
 *     1. mutualisation : une part r de l'applicatif et des licences est redondante ; on n'en
 *        garde qu'un résidu (paramétrage, intégration, données locales) ;
 *     2. internalisation : tout le travail applicatif (y compris celui que l'on achetait sous
 *        forme de licences) est fait par des ingénieurs publics au coût cc, au lieu d'un mélange
 *        d'agents (coût ci) et de prestataires (coût ce) ;
 *     3. productivité de l'IA (loi d'Amdahl) : m_eff = 1 / ((1 − p) + p / m), où p est la part
 *        du travail que l'IA accélère et m le gain sur cette part ; chaque ingénieur coûte en
 *        plus un budget de calcul d'IA ;
 *     4. consolidation de l'infrastructure : −g ;
 *     + surcoût de sécurité de la cible (red teaming permanent, supervision, cloisonnement).
 *   Transition : construction + double fonctionnement + migration + sécurité initiale,
 *   majorés d'un dépassement de coût (Flyvbjerg & Budzier : +27 % en moyenne sur 1 471
 *   projets informatiques ; 1 projet sur 6 dépasse de 200 % en moyenne).
 * Hypothèses H1 à H18 : voir methode.md. Ordres de grandeur, jamais des prédictions.
 */
(function (root) {
  'use strict';

  // ---------- Données de départ (voir donnees/*.csv et methode.md ; ⚠️ = non confirmé) ----------
  var DONNEES = {
    // Dépense numérique annuelle par sphère, Md€ [bas, central, haut] (H1, ⚠️ reconstitution).
    depenseMdE: {
      // 4,2 Md€ hors opérateurs (ministres, AN 05/2026) ; 5,5 Md€ (Cour 10/2026 via AFP) ;
      // 7 = 5,5 + opérateurs de l'État hors France Travail (hypothèse de Claude).
      etatOperateurs: [4.2, 5.5, 7.0],
      // CNAM ≈ 0,38 (IGAS, 2018-2022) + CNAF 0,15 (maîtrise d'œuvre seule) + France Travail
      // 0,45 (2018) ≈ 1,0 connu ; CNAV, Urssaf, MSA, Agirc-Arrco inconnus (hypothèse).
      securiteSociale: [1.5, 2.0, 2.5],
      // 3,4 Md€ (Markess 2024, hors personnel, matériel, télécoms) ; + personnel et matériel (hypothèse).
      collectivites: [3.4, 4.5, 6.0],
      // 1,7 % (Cour 01/2025 ⚠️) × 132 Md€ de dépenses des hôpitaux publics (Insee 2024) ≈ 2,2.
      hopitaux: [1.8, 2.2, 2.6]
    },
    // Répartition de la dépense (H3, hypothèse de Claude ⚠️) : somme = 1.
    partInfra: 0.45,
    partApplicatif: 0.40,
    partLicences: 0.15,
    // Coût annuel complet d'un ETP, k€.
    coutEtpInterneActuelKE: 80,   // H6 : agent public informaticien, chargé (hypothèse ⚠️)
    coutEtpExterneKE: 184         // H7 : 460 M€ ≈ 2 500 ETP de prestations (Sénat 2016)
  };

  // ---------- Scénarios ----------
  // Gain de productivité de l'IA sur les tâches qu'elle accélère (m).
  var PRODUCTIVITE = {
    'x1.2': { m: 1.2, libelle: '×1,2 — essais contrôlés et études de terrain 2023-2026 (×0,84 à ×1,29)' },
    'x2': { m: 2, libelle: '×2 — haut des mesures (essai en laboratoire ×2,3 ; METR 2026 ≈ ×1,5, 30 % de chances de ×2)' },
    'x5': { m: 5, libelle: '×5 — extrapolation (agents autonomes), non mesurée' },
    'x100': { m: 100, libelle: '×100 — témoignage de l\'auteur, scénario extrême, non mesuré' }
  };

  // Paramètres d'organisation : bas = prudent, haut = favorable à la thèse.
  var ORGANISATION = {
    bas: {
      r: 0.15, residuel: 0.5,      // mutualisation
      e: 0.4,                      // part sous-traitée du travail applicatif actuel
      coutIngenieurKE: 110,        // coût d'un ingénieur public de la cible (attirer des profils rares)
      p: 0.4,                      // part du travail accélérée par l'IA
      calculIaKE: 20,              // calcul d'IA par ingénieur et par an
      g: 0.0,                      // consolidation de l'infrastructure
      surcoutSecurite: 0.10,       // sécurité de la cible, en % du budget cible hors sécurité
      constructionAns: 5, chevauchementAns: 4, partDoubleFonctionnement: 0.6, migrationAnnees: 1.0,
      depassement: 1.0, dureeAns: 15
    },
    central: {
      r: 0.30, residuel: 0.4, e: 0.5, coutIngenieurKE: 100, p: 0.6, calculIaKE: 15, g: 0.05,
      surcoutSecurite: 0.07, constructionAns: 3, chevauchementAns: 3, partDoubleFonctionnement: 0.5,
      migrationAnnees: 0.75, depassement: 0.27, dureeAns: 10
    },
    haut: {
      r: 0.45, residuel: 0.3, e: 0.6, coutIngenieurKE: 90, p: 0.8, calculIaKE: 10, g: 0.10,
      surcoutSecurite: 0.05, constructionAns: 2, chevauchementAns: 2, partDoubleFonctionnement: 0.4,
      migrationAnnees: 0.5, depassement: 0.0, dureeAns: 6
    }
  };

  function fusion(base, sur) { var o = {}, k; for (k in base) o[k] = base[k]; if (sur) for (k in sur) o[k] = sur[k]; return o; }

  /** Productivité effective (loi d'Amdahl). */
  function productiviteEffective(m, p) {
    if (!(m > 0)) throw new Error('m doit être > 0');
    return 1 / ((1 - p) + p / m);
  }

  /** Dépense actuelle (Md€/an) : niveau 0 = bas, 1 = central, 2 = haut. */
  function coutActuel(niveau, donnees) {
    var d = donnees || DONNEES, i = niveau === undefined ? 1 : niveau, parSphere = {}, total = 0;
    for (var k in d.depenseMdE) { parSphere[k] = d.depenseMdE[k][i]; total += d.depenseMdE[k][i]; }
    return {
      totalMdE: total, parSphere: parSphere,
      infraMdE: total * d.partInfra, applicatifMdE: total * d.partApplicatif, licencesMdE: total * d.partLicences
    };
  }

  /**
   * Coût cible en régime permanent, effectifs et coût de transition.
   * p = { productivite: 'x1.2'|'x2'|'x5'|'x100' (ou m: nombre), organisation: 'bas'|'central'|'haut',
   *       niveauCout: 0|1|2, surcharges: { …paramètres d'organisation à remplacer } }
   */
  function simuler(p, donnees) {
    p = p || {};
    var d = donnees || DONNEES;
    var org = fusion(ORGANISATION[p.organisation || 'central'], p.surcharges);
    var m = p.m !== undefined ? p.m : PRODUCTIVITE[p.productivite || 'x2'].m;
    var c0 = coutActuel(p.niveauCout, d);
    var mEff = productiviteEffective(m, org.p);
    var ci = d.coutEtpInterneActuelKE * 1e-6, ce = d.coutEtpExterneKE * 1e-6;   // Md€ par ETP

    // Effectifs applicatifs actuels (ETP) : agents + prestataires.
    var etpInternes = c0.applicatifMdE * (1 - org.e) / ci;
    var etpExternes = c0.applicatifMdE * org.e / ce;
    var etpLicences = c0.licencesMdE / ce;   // travail « contenu » dans les licences (H12)

    // 1. Mutualisation.
    var fm = 1 - org.r * (1 - org.residuel);
    var app1 = c0.applicatifMdE * fm, lic1 = c0.licencesMdE * fm;
    // 2. Internalisation : le même travail (en ETP) fait par des ingénieurs publics au coût cc.
    var etp1 = (etpInternes + etpExternes + etpLicences) * fm;
    var cc = org.coutIngenieurKE * 1e-6;
    var travail2 = etp1 * cc;
    // 3. IA : effectifs divisés par m_eff, plus le calcul d'IA par ingénieur.
    var etpCible = etp1 / mEff;
    var travail3 = etpCible * (cc + org.calculIaKE * 1e-6);
    // 4. Infrastructure.
    var infra = c0.infraMdE * (1 - org.g);
    var securite = (infra + travail3) * org.surcoutSecurite;
    var cible = infra + travail3 + securite;
    var economie = c0.totalMdE - cible;

    // Transition.
    var construction = travail3 * org.constructionAns * 0.5;   // H14 : montée en charge linéaire de l'équipe
    var doubleFonct = (c0.applicatifMdE + c0.licencesMdE) * org.partDoubleFonctionnement * org.chevauchementAns;
    var migration = c0.applicatifMdE * org.migrationAnnees / mEff;
    var securiteInitiale = securite * 2;   // H16 : deux années de montée en charge
    var brut = construction + doubleFonct + migration + securiteInitiale;
    var transition = brut * (1 + org.depassement);

    return {
      m: m, p: org.p, mEff: mEff, organisation: p.organisation || 'central',
      coutActuelMdE: c0.totalMdE, coutCibleMdE: cible, economieMdE: economie,
      economiePct: 100 * economie / c0.totalMdE,
      decomposition: {
        mutualisationMdE: (c0.applicatifMdE + c0.licencesMdE) - (app1 + lic1),
        internalisationMdE: (app1 + lic1) - travail2,
        iaMdE: travail2 - travail3,
        infraMdE: c0.infraMdE - infra,
        securiteMdE: -securite
      },
      effectifs: {
        agentsActuelsEtp: etpInternes, prestatairesActuelsEtp: etpExternes,
        travailLicencesEtp: etpLicences, ingenieursCibleEtp: etpCible
      },
      transition: {
        dureeAns: org.dureeAns, constructionMdE: construction, doubleFonctionnementMdE: doubleFonct,
        migrationMdE: migration, securiteInitialeMdE: securiteInitiale, totalBrutMdE: brut,
        totalMdE: transition, retourAns: economie > 0 ? transition / economie : Infinity
      }
    };
  }

  /** Tableau croisé organisation × productivité. */
  function grille(donnees, niveauCout) {
    var r = {};
    for (var o in ORGANISATION) {
      r[o] = {};
      for (var k in PRODUCTIVITE) r[o][k] = simuler({ productivite: k, organisation: o, niveauCout: niveauCout }, donnees);
    }
    return r;
  }

  var API = {
    DONNEES: DONNEES, PRODUCTIVITE: PRODUCTIVITE, ORGANISATION: ORGANISATION,
    productiviteEffective: productiviteEffective, coutActuel: coutActuel, simuler: simuler, grille: grille
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.EtatPlateforme = API;
})(this);
