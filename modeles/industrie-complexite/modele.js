/*
 * modeles/industrie-complexite/modele.js
 * Fonctions pures, sans dépendance, pour estimer la taille de « l'industrie de la complexité »
 * (activité qui existe parce que les règles fiscales et sociales sont complexes) et ce qu'il
 * en advient si la paie, la comptabilité de base et l'impôt passent par un système public simple.
 *
 * Chaque segment a : un chiffre d'affaires ou un coût (Md€/an), des emplois, et trois parts
 * par scénario (bas / central / haut) :
 *   - partComplexite : part de l'activité qui tient à la complexité fiscale et sociale ;
 *   - partDisparait  : part de cette activité « complexité » qui disparaît ;
 *   - partTransforme : part qui se transforme (audit, conseil de gestion, accompagnement).
 *   Le reste de l'activité « complexité » demeure (1 - disparaît - transforme).
 * Ce sont des hypothèses et des ordres de grandeur, jamais des prédictions (methode.md, H1-H12).
 * Compatible navigateur, Node (module.exports) et JavaScriptCore (jsc).
 */
(function (root) {
  'use strict';

  var SCENARIOS = ['bas', 'central', 'haut'];

  /** Valeur d'un paramètre : nombre fixe ou objet {bas, central, haut}. */
  function val(p, sc) {
    if (p === null || p === undefined) return 0;
    if (typeof p === 'number') return p;
    if (p[sc] === undefined) throw new Error('scénario absent : ' + sc);
    return p[sc];
  }

  /** Évalue un segment pour un scénario. Montants en Md€/an, emplois en personnes. */
  function evaluerSegment(seg, sc) {
    var base = val(seg.montant, sc), emp = val(seg.emplois, sc);
    var pc = val(seg.partComplexite, sc), pd = val(seg.partDisparait, sc), pt = val(seg.partTransforme, sc);
    if (pc < 0 || pc > 1 || pd < 0 || pt < 0 || pd + pt > 1 + 1e-9) throw new Error('parts incohérentes : ' + seg.id);
    var mC = base * pc, eC = emp * pc;
    return {
      id: seg.id, nom: seg.nom, bloc: seg.bloc, marchand: seg.marchand !== false,
      montant: base, emplois: emp,
      montantComplexite: mC, emploisComplexite: eC,
      montantDisparait: mC * pd, emploisDisparait: eC * pd,
      montantTransforme: mC * pt, emploisTransforme: eC * pt,
      montantReste: mC * (1 - pd - pt), emploisReste: eC * (1 - pd - pt)
    };
  }

  /** Évalue tous les segments ; totaux par bloc et totaux généraux. */
  function evaluer(segments, sc) {
    var det = segments.map(function (s) { return evaluerSegment(s, sc); });
    var champs = ['montant', 'emplois', 'montantComplexite', 'emploisComplexite', 'montantDisparait',
      'emploisDisparait', 'montantTransforme', 'emploisTransforme', 'montantReste', 'emploisReste'];
    function somme(liste) {
      var t = {}; champs.forEach(function (c) { t[c] = 0; });
      liste.forEach(function (d) { champs.forEach(function (c) { t[c] += d[c]; }); });
      return t;
    }
    var blocs = {};
    det.forEach(function (d) { (blocs[d.bloc] = blocs[d.bloc] || []).push(d); });
    var parBloc = {};
    Object.keys(blocs).forEach(function (b) { parBloc[b] = somme(blocs[b]); });
    return { scenario: sc, detail: det, parBloc: parBloc, total: somme(det) };
  }

  /**
   * Gain pour l'économie (Md€/an, en régime de croisière).
   *  - coutEvite : dépenses que les clients (entreprises, ménages) n'ont plus à faire
   *    = montant qui disparaît. C'est une économie pour eux, pas pour le budget public,
   *    et c'est aussi un revenu en moins pour le secteur : à court terme, c'est un transfert.
   *  - gainReel : la vraie richesse créée vient du travail libéré et réemployé ailleurs
   *    = emplois qui disparaissent × taux de réemploi × valeur ajoutée par emploi (Md€).
   *  - coutTransition : coût ponctuel (formation, revenu pendant la transition),
   *    = emplois qui disparaissent × coût par reconversion (€) / 1e9.
   *  - coutSystemePublic : coût annuel du système public simple qui remplace (Md€/an).
   */
  function gainEconomie(res, p) {
    var t = res.total;
    var coutEvite = t.montantDisparait;
    var reemploi = p.tauxReemploi;
    var gainReel = t.emploisDisparait * reemploi * p.vaParEmploi / 1e9;
    var coutTransition = t.emploisDisparait * p.coutReconversion / 1e9;
    var net = gainReel - (p.coutSystemePublic || 0);
    return {
      coutEvite: coutEvite,
      gainReel: gainReel,
      gainReelNet: net,
      coutTransitionPonctuel: coutTransition,
      anneesPourAmortir: net > 0 ? coutTransition / net : Infinity,
      pctPIB: p.pib ? net / p.pib * 100 : NaN
    };
  }

  /**
   * Répartit les personnes à reconvertir entre des métiers d'arrivée.
   * destinations : [{metier, part, competences}] ; les parts sont normalisées.
   */
  function reconversion(personnes, destinations) {
    var tot = destinations.reduce(function (a, d) { return a + d.part; }, 0);
    return destinations.map(function (d) {
      return { metier: d.metier, personnes: personnes * d.part / tot, competences: d.competences };
    });
  }

  /**
   * Personnes à reconvertir sur une durée de transition.
   * emploisDisparus : postes supprimés ; emploisExposes : effectif des activités « complexité »
   * dont une partie part à la retraite chaque année (tauxDepart) ; si l'on ne remplace pas
   * ces départs, ils absorbent une part des suppressions (H10).
   */
  function fluxAnnuel(emploisDisparus, dureeAnnees, emploisExposes, tauxDepart) {
    var brut = emploisDisparus / dureeAnnees;
    var departs = (emploisExposes || 0) * (tauxDepart || 0);
    var parRetraite = Math.min(brut, departs);
    return {
      brutParAn: brut, departsRetraiteParAn: departs, absorbeParRetraiteParAn: parRetraite,
      aReconvertirParAn: brut - parRetraite, aReconvertirTotal: (brut - parRetraite) * dureeAnnees
    };
  }

  /** Temps des ménages (non marchand) : heures/an × nombre × valeur de l'heure -> Md€. */
  function valeurTemps(heuresParUnite, unites, valeurHeure) {
    return heuresParUnite * unites * valeurHeure / 1e9;
  }

  /** Lecteur CSV minimal (guillemets doubles, virgules). */
  function parseCSV(txt) {
    var lignes = [], champ = '', ligne = [], q = false, i, c;
    for (i = 0; i < txt.length; i++) {
      c = txt[i];
      if (q) {
        if (c === '"') { if (txt[i + 1] === '"') { champ += '"'; i++; } else q = false; }
        else champ += c;
      } else if (c === '"') q = true;
      else if (c === ',') { ligne.push(champ); champ = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && txt[i + 1] === '\n') i++;
        ligne.push(champ); champ = '';
        if (ligne.length > 1 || ligne[0] !== '') lignes.push(ligne);
        ligne = [];
      } else champ += c;
    }
    if (champ !== '' || ligne.length) { ligne.push(champ); lignes.push(ligne); }
    var tete = lignes.shift();
    return lignes.map(function (l) { var o = {}; tete.forEach(function (h, j) { o[h] = l[j]; }); return o; });
  }

  // ---------- Paramètres par défaut : France, données 2024-2025 (voir donnees/ et methode.md) ----------

  // Constantes lues dans les données (montants en Md€, emplois en personnes)
  var D = {
    ca6920: 28.038, personnes6920: 221053, va6920: 17.129, fraisPersonnel6920: 14.217, etp6920: 195094, // Eurostat SBS 2024
    honorairesAuditLegal: 2.968,                                   // H2A, rapport 2025
    ca6910: 31.892, personnes6910: 190026,                          // Eurostat SBS 2024 (avocats, notaires, commissaires de justice)
    // Éditeurs et prestataires de paie : somme des CA des entités françaises (comptes déposés, années 2022-2025)
    caEditeursPaie: 0.664 + 0.380 + 0.314 + 0.240 + 0.0565 + 0.041 + 0.0517 + 0.0433 + 0.080,
    caCabinetsCIRObserves: 0.101 + 0.046 + 0.0457 + 0.0334 + 0.026 + 0.0073, // Ayming, Leyton, FI, ABGI, GAC, Abington
    cirCii: 8.041 + 0.230,                                           // coût 2026 (Sénat, PLF 2026)
    caAnacofi: 3.0, emploisAnacofi: 30000,                           // ⚠️ auto-déclaré
    metiersCompta2019: 284000 + 452000 + 688000,                     // Métiers 2030 : L1Z + L4Z + L5Z
    departsCompta2019_2030: 85000 + 109000 + 212000,                 // départs en fin de carrière, 11 ans
    declarationsIR: 41.5e6,                                          // ⚠️ presse
    pib: 2935                                                        // Insee, 2024
  };
  D.emploisParMdEur6920 = D.personnes6920 / D.ca6920;                // ≈ 7 884 personnes par Md€
  D.coutParEmploi = D.fraisPersonnel6920 * 1e9 / D.etp6920;          // ≈ 72 900 € par ETP (H8)
  D.vaParEmploi = D.va6920 * 1e9 / D.personnes6920;                  // ≈ 77 500 € par personne occupée
  D.emploisAudit = D.honorairesAuditLegal * D.emploisParMdEur6920;   // dérivé (H2)
  D.tauxDepartAnnuel = D.departsCompta2019_2030 / D.metiersCompta2019 / 11; // ≈ 2,6 %/an

  function sc3(b, c, h) { return { bas: b, central: c, haut: h }; }

  // Hypothèses H1-H9 de methode.md. « bas » = petite industrie et faible disparition ; « haut » = l'inverse.
  var SEGMENTS = [
    { id: 'expertise', bloc: 'A. Marché externe', nom: 'Expertise comptable (NAF 69.20 hors audit légal)',
      montant: D.ca6920 - D.honorairesAuditLegal, emplois: D.personnes6920 - D.emploisAudit,
      partComplexite: sc3(0.35, 0.50, 0.65), partDisparait: sc3(0.40, 0.60, 0.80), partTransforme: sc3(0.40, 0.30, 0.15) },
    { id: 'audit', bloc: 'A. Marché externe', nom: 'Audit légal (commissaires aux comptes)',
      montant: D.honorairesAuditLegal, emplois: D.emploisAudit,
      partComplexite: sc3(0.05, 0.10, 0.15), partDisparait: sc3(0.20, 0.30, 0.40), partTransforme: sc3(0.50, 0.50, 0.50) },
    { id: 'juridique', bloc: 'A. Marché externe', nom: 'Activités juridiques (NAF 69.10) : part fiscale et sociale',
      montant: D.ca6910, emplois: D.personnes6910,
      partComplexite: sc3(0.05, 0.10, 0.15), partDisparait: sc3(0.30, 0.50, 0.70), partTransforme: sc3(0.30, 0.30, 0.20) },
    { id: 'paie', bloc: 'A. Marché externe', nom: 'Éditeurs et prestataires de paie (entités observées)',
      // V6655 : une partie du CA des éditeurs est payée par les cabinets (consommation intermédiaire, déjà dans leur CA) : on la retire.
      montant: sc3(D.caEditeursPaie * 0.4, D.caEditeursPaie * 0.6, D.caEditeursPaie * 0.8),
      emplois: sc3(D.caEditeursPaie * 0.4e9 / 200000, D.caEditeursPaie * 0.6e9 / 200000, D.caEditeursPaie * 0.8e9 / 200000),
      partComplexite: sc3(0.40, 0.50, 0.60), partDisparait: sc3(0.30, 0.50, 0.70), partTransforme: sc3(0.40, 0.30, 0.20) },
    { id: 'cir', bloc: 'A. Marché externe', nom: 'Cabinets de crédit d\'impôt et d\'optimisation des charges',
      montant: sc3(D.caCabinetsCIRObserves, 0.07 * D.cirCii, 0.10 * D.cirCii),
      emplois: sc3(D.caCabinetsCIRObserves * 1e9 / 150000, 0.07 * D.cirCii * 1e9 / 150000, 0.10 * D.cirCii * 1e9 / 150000),
      partComplexite: 1, partDisparait: sc3(0.60, 0.80, 0.95), partTransforme: sc3(0.30, 0.15, 0.05) },
    { id: 'patrimoine', bloc: 'A. Marché externe', nom: 'Conseil en gestion de patrimoine : part défiscalisation',
      montant: D.caAnacofi, emplois: D.emploisAnacofi,
      partComplexite: sc3(0.15, 0.25, 0.35), partDisparait: sc3(0.50, 0.70, 0.90), partTransforme: sc3(0.30, 0.20, 0.10) },
    { id: 'interne', bloc: 'B. Travail interne des employeurs', nom: 'Services comptables, paie et fiscalité internes',
      montant: (D.metiersCompta2019 - D.personnes6920) * D.coutParEmploi / 1e9, emplois: D.metiersCompta2019 - D.personnes6920,
      partComplexite: sc3(0.15, 0.25, 0.35), partDisparait: sc3(0.40, 0.60, 0.80), partTransforme: sc3(0.40, 0.30, 0.15) },
    { id: 'menages', bloc: 'C. Temps des ménages', nom: 'Déclarations et démarches fiscales et sociales des ménages', marchand: false,
      montant: sc3(D.declarationsIR * 1 * 12 / 1e9, D.declarationsIR * 2 * 12 / 1e9, D.declarationsIR * 4 * 12 / 1e9), emplois: 0,
      partComplexite: 1, partDisparait: sc3(0.50, 0.70, 0.90), partTransforme: 0 }
  ];

  var PARAMS_GAIN = {
    bas: { tauxReemploi: 0.6, vaParEmploi: D.vaParEmploi, coutReconversion: 29000, coutSystemePublic: 1.5, pib: D.pib, dureeTransition: 15 },
    central: { tauxReemploi: 0.8, vaParEmploi: D.vaParEmploi, coutReconversion: 10000, coutSystemePublic: 1.0, pib: D.pib, dureeTransition: 10 },
    haut: { tauxReemploi: 0.9, vaParEmploi: D.vaParEmploi, coutReconversion: 5000, coutSystemePublic: 0.5, pib: D.pib, dureeTransition: 5 }
  };

  // Métiers d'arrivée (H11) : parts indicatives, à discuter ; besoins sourcés dans reconversion_metiers.csv
  var DESTINATIONS = [
    { metier: 'Contrôle de gestion, audit, conseil de gestion aux TPE-PME', part: 0.35,
      competences: 'lecture des comptes, relation avec les dirigeants, rigueur chiffrée' },
    { metier: 'Numérique : qualité des données, développement et support du système public', part: 0.15,
      competences: 'connaissance fine des flux de paie et de facturation, logique des règles' },
    { metier: 'Contrôle, lutte contre la fraude, accompagnement des usagers (France services)', part: 0.10,
      competences: 'droit fiscal et social, pédagogie, traitement de dossiers' },
    { metier: 'Enseignement (mathématiques, économie-gestion, formation des adultes)', part: 0.10,
      competences: 'pédagogie du chiffre, connaissance de l\'entreprise' },
    { metier: 'Santé et aide à la personne (formation longue)', part: 0.15,
      competences: 'organisation, relation humaine ; diplôme à acquérir' },
    { metier: 'Industrie et métiers techniques en tension', part: 0.05,
      competences: 'méthode, gestion de la production ; formation technique à acquérir' },
    { metier: 'Création ou reprise d\'entreprise, autres', part: 0.10,
      competences: 'connaissance de la gestion d\'une petite entreprise' }
  ];

  // Contrôle de remplacement (T22) : indicateurs OCDE de réglementation des marchés de produits (PMR).
  // lignes : sorties de parseCSV(pmr_ocde.csv). Renvoie la valeur du pays, la moyenne simple des comparateurs et le rang (1 = le moins restrictif).
  function positionPMR(lignes, mesure, annee, pays, comparateurs) {
    var cle = '(' + mesure + ')';
    var v = {};
    lignes.forEach(function (l) {
      if (l.indicateur.indexOf(cle) > -1 && String(l['année']) === String(annee)) v[l.pays] = +l.valeur;
    });
    if (!(pays in v)) throw new Error('PMR : pas de valeur pour ' + pays + ' (' + mesure + ', ' + annee + ')');
    var autres = comparateurs.filter(function (c) { return c !== pays; });
    var somme = 0, rang = 1;
    autres.forEach(function (c) {
      if (!(c in v)) throw new Error('PMR : pas de valeur pour ' + c);
      somme += v[c]; if (v[c] < v[pays]) rang++;
    });
    var moyenne = somme / autres.length;
    return { valeur: v[pays], moyenneComparateurs: moyenne, ecart: v[pays] - moyenne, rang: rang, sur: autres.length + 1 };
  }

  // Contrôle externe (V6652) : coût de conformité fiscale des PME selon VVA/KPMG 2022 = 1,3 % du PIB (204 Md€, UE-28, enquête 2019),
  // appliqué à un PIB national ; ratioHeures (ex. 139/170) ajuste au niveau de charge du pays. Ordre de grandeur, pas une mesure.
  function coutConformiteVVA(pibMdEur, partPIB, ratioHeures) {
    return pibMdEur * partPIB * (ratioHeures === undefined ? 1 : ratioHeures);
  }

  // Borne observée de la part de temps de conformité supprimable (V6653) : 1 - heures du meilleur comparateur / heures du pays.
  function partSupprimableObservee(heuresPays, heuresMeilleur) {
    return 1 - heuresMeilleur / heuresPays;
  }

  // Plancher d'ETP de conformité fiscale (recoupement du bloc B) : heures annuelles d'un employeur × nombre d'employeurs ÷ heures d'un ETP.
  function etpConformite(heuresParEmployeur, employeurs, heuresParETP) {
    return heuresParEmployeur * employeurs / heuresParETP;
  }


  // ---------------------------------------------------------------------------------------------
  // v2 : optimisation patrimoniale et successorale (T6 v2, 02/11/2026). Voir methode.md « v2 ».
  // Double captation : (1) recettes perdues par le pot commun ; (2) temps qualifié mobilisé.
  // Tout est hypothèse ou ordre de grandeur ; les sources sont dans donnees/optimisation_patrimoniale.csv.
  // ---------------------------------------------------------------------------------------------

  /** Postes de recettes en jeu (Md€/an) : coût des régimes de faveur à la transmission, avant réaction. */
  var POSTES_RECETTES = [
    { id: 'dutreil', nom: 'Pacte Dutreil (CGI 787 B et C)', montant: { bas: 4.0, central: 5.0, haut: 5.7 }, statut: 'mesure/estimation',
      note: 'PLF 2026 V&M t.2 ligne 520110 : 5,0 (réalisation 2024) puis 4,0 ; Cour des comptes 2025 : 5,5 ; IPP : 4,85 à 5,7' },
    { id: 'assurance_vie', nom: 'Assurance-vie hors succession (CGI 990 I et 757 B), écart au barème de droit commun', montant: { bas: 4.0, central: 4.5, haut: 5.0 }, statut: 'estimation ancienne',
      note: 'CAE n°69 (2021) : 4 à 5 Md€, données 2017-2018 ; non classé dépense fiscale' },
    { id: 'demembrement', nom: 'Donation en nue-propriété (démembrement, CGI 669)', montant: { bas: 2.0, central: 2.5, haut: 3.0 }, statut: 'estimation ancienne',
      note: 'CAE n°69 : 2 à 3 Md€, données vers 2006 ; recoupement possible avec Dutreil' },
    { id: 'autres_exonerations', nom: 'Autres exonérations et abattements classés dépenses fiscales (forêts, handicap, Natura 2000, 520201, 580102)', montant: { bas: 0.3, central: 0.3, haut: 0.3 }, statut: 'mesure',
      note: 'PLF 2026 V&M t.2 : 50 + 100 + 12 + 120 = 282 M€ (2024) ; beaucoup de lignes « nc »' }
  ];

  /** Recettes en jeu : somme des postes (Md€/an), avant réaction des comportements. */
  function recettesEnJeu(postes, sc) {
    var det = postes.map(function (p) { return { id: p.id, montant: val(p.montant, sc) }; });
    var total = det.reduce(function (a, d) { return a + d.montant; }, 0);
    return { detail: det, total: total };
  }

  /**
   * Rendement net d'une suppression ou d'un plafonnement des régimes de faveur.
   *  partRecuperee : part du coût brut réellement récupérée (le reste migre vers d'autres montages
   *                  ou est ré-exonéré : « migration de la complexité », H3 de la v1) ;
   *  fuite         : part de l'assiette perdue par départ ou renoncement (Kleven et al., CAE : de l'ordre de 10 %).
   * Résultat en Md€/an.
   */
  function rendementReforme(brut, partRecuperee, fuite) {
    if (partRecuperee < 0 || partRecuperee > 1 || fuite < 0 || fuite > 1) throw new Error('parts hors de [0,1]');
    return brut * partRecuperee * (1 - fuite);
  }

  var PARAMS_REFORME = {
    partRecuperee: { bas: 0.4, central: 0.6, haut: 0.8 },
    fuite: { bas: 0.20, central: 0.10, haut: 0.05 }
  };

  /**
   * Segments de « matière grise » patrimoniale. partComplexite = part de l'activité qui tient à
   * l'optimisation patrimoniale et successorale ; elle est le produit de deux parts (famille/patrimoine
   * dans l'activité, puis part « complexité » dans cette activité), calculé par produitParts().
   * Montants en Md€ de chiffre d'affaires, emplois en personnes occupées.
   */
  function produitParts(a, b) { return { bas: a.bas * b.bas, central: a.central * b.central, haut: a.haut * b.haut }; }

  var SEGMENTS_PATRIMOINE = [
    { id: 'cgp', nom: 'Conseil en gestion de patrimoine (CGP, CIF, courtiers : périmètre ANACOFI)', bloc: 'P', montant: 3.0, emplois: 30000,
      partComplexite: { bas: 0.10, central: 0.20, haut: 0.30 }, partDisparait: { bas: 0.3, central: 0.5, haut: 0.7 }, partTransforme: { bas: 0.4, central: 0.3, haut: 0.2 } },
    { id: 'notaires', nom: 'Notariat (hors immobilier : famille, successions, donations, régimes matrimoniaux)', bloc: 'P', montant: 8.5, emplois: 51000,
      partComplexite: produitParts({ bas: 0.10, central: 0.15, haut: 0.20 }, { bas: 0.30, central: 0.50, haut: 0.70 }),
      partDisparait: { bas: 0.3, central: 0.5, haut: 0.7 }, partTransforme: { bas: 0.4, central: 0.3, haut: 0.2 } },
    { id: 'juristes', nom: 'Avocats et autres juristes (NAF 69.10 hors notariat) : fiscalité et droit patrimonial des particuliers et dirigeants', bloc: 'P', montant: 23.4, emplois: 139000,
      partComplexite: produitParts({ bas: 0.04, central: 0.06, haut: 0.08 }, { bas: 0.30, central: 0.50, haut: 0.70 }),
      partDisparait: { bas: 0.3, central: 0.5, haut: 0.7 }, partTransforme: { bas: 0.4, central: 0.3, haut: 0.2 } }
  ];

  /** Valeur ajoutée du segment : CA qui tient à la complexité × ratio VA/CA (69.10 : 22 107 / 31 892). */
  function evaluerPatrimoine(sc, ratioVA) {
    var res = evaluer(SEGMENTS_PATRIMOINE, sc);
    var t = res.total;
    return { detail: res.detail, total: t, vaComplexite: t.montantComplexite * ratioVA, vaDisparait: t.montantDisparait * ratioVA };
  }

  /**
   * Coût d'opportunité de la matière grise mobilisée (Md€/an et coût ponctuel).
   *  emplois      : emplois dont l'activité disparaît ;
   *  valeurEmploi : valeur ajoutée annuelle par emploi qualifié (€) ;
   *  produitSocialIci / produitSocialAilleurs : ratio produit social / produit privé de l'activité (Lockwood-Nathanson-Weyl) ;
   *  tauxReallocation : part effectivement réemployée ailleurs ;
   *  coutReconversion : coût ponctuel de formation par personne (€).
   * gainAnnuel = emplois × taux × valeur × (ailleurs − ici) ; la part non réemployée ne produit pas de gain (prudence).
   */
  function coutOpportunite(emplois, valeurEmploi, produitSocialIci, produitSocialAilleurs, tauxReallocation, coutReconversion) {
    var reemployes = emplois * tauxReallocation;
    var gain = reemployes * valeurEmploi * (produitSocialAilleurs - produitSocialIci) / 1e9;
    var cout = emplois * coutReconversion / 1e9;
    return { reemployes: reemployes, gainAnnuel: gain, coutPonctuel: cout, anneesPourAmortir: gain > 0 ? cout / gain : Infinity };
  }

  var PARAMS_OPPORTUNITE = {
    valeurEmploi: { bas: 90000, central: 116000, haut: 140000 },   // central : VA/personne occupée NAF 69.10 (22 107 M€ / 190 026)
    produitSocialIci: { bas: 0.5, central: 0.25, haut: 0.0 },       // hypothèse : activité de pure complexité = 0, service rendu = 1
    produitSocialAilleurs: { bas: 0.7, central: 0.85, haut: 1.0 },
    tauxReallocation: { bas: 0.5, central: 0.7, haut: 0.9 },        // repère : 59 % en poste lié 6 mois après un PTP (OTP 2023)
    coutReconversion: { bas: 29000, central: 10000, haut: 5000 }    // mêmes bornes que H12 de la v1
  };

  /** Bilan v2 d'un scénario : recettes en jeu, rendement net, matière grise, coût d'opportunité. */
  function bilanPatrimoine(sc) {
    var rec = recettesEnJeu(POSTES_RECETTES, sc);
    var net = rendementReforme(rec.total, val(PARAMS_REFORME.partRecuperee, sc), val(PARAMS_REFORME.fuite, sc));
    var pat = evaluerPatrimoine(sc, 22107 / 31892);
    var op = coutOpportunite(pat.total.emploisDisparait, val(PARAMS_OPPORTUNITE.valeurEmploi, sc),
      val(PARAMS_OPPORTUNITE.produitSocialIci, sc), val(PARAMS_OPPORTUNITE.produitSocialAilleurs, sc),
      val(PARAMS_OPPORTUNITE.tauxReallocation, sc), val(PARAMS_OPPORTUNITE.coutReconversion, sc));
    return { recettesBrutes: rec, recettesNettes: net, patrimoine: pat, opportunite: op };
  }

  var api = {
    positionPMR: positionPMR, etpConformite: etpConformite, coutConformiteVVA: coutConformiteVVA, partSupprimableObservee: partSupprimableObservee,
    D: D, SEGMENTS: SEGMENTS, PARAMS_GAIN: PARAMS_GAIN, DESTINATIONS: DESTINATIONS,
    SCENARIOS: SCENARIOS, val: val, evaluerSegment: evaluerSegment, evaluer: evaluer,
    gainEconomie: gainEconomie, reconversion: reconversion, fluxAnnuel: fluxAnnuel,
    valeurTemps: valeurTemps, parseCSV: parseCSV,
    POSTES_RECETTES: POSTES_RECETTES, recettesEnJeu: recettesEnJeu, rendementReforme: rendementReforme, PARAMS_REFORME: PARAMS_REFORME,
    SEGMENTS_PATRIMOINE: SEGMENTS_PATRIMOINE, evaluerPatrimoine: evaluerPatrimoine, produitParts: produitParts,
    coutOpportunite: coutOpportunite, PARAMS_OPPORTUNITE: PARAMS_OPPORTUNITE, bilanPatrimoine: bilanPatrimoine
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IndustrieComplexite = api;
})(this);
