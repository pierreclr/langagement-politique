/*
 * modeles/batisseurs-et-repas/modele.js
 * Chiffrage de deux mesures de la section « Idéologie et direction » (09/11/2026) :
 *   1. Former les bâtisseurs (rénovation des passoires) et, plus brièvement, les agriculteurs ;
 *   2. Les repas à prix coûtant (« usines à repas » : cuisine publique, bio, insertion, vente à emporter).
 *
 * Fonctions pures, sans dépendance. Compatible navigateur, Node (module.exports) et JavaScriptCore (jsc).
 * Hypothèses et ordres de grandeur, jamais des prédictions (methode.md, H1 à H40).
 * Scénarios : 'favorable' / 'central' / 'defavorable' (pour le coût et l'efficacité de la mesure).
 */
(function (root) {
  'use strict';

  var SCENARIOS = ['favorable', 'central', 'defavorable'];

  /* ---------------- Données sourcées (donnees/sources.csv ; cotes A-D dans methode.md) ---------------- */
  var D = {
    // SDES, parc au 01/01/2025, France métropolitaine, résidences principales (publié le 12/11/2025) [A]
    residencesPrincipales: 30.9e6,
    partsClasses: { A: 0.033, B: 0.053, C: 0.272, D: 0.337, E: 0.178, F: 0.079, G: 0.048 },
    passoiresParcTotal: 5.4e6,          // F + G, ensemble du parc (37,4 M logements, vacants et secondaires compris) [A]
    // SDES, rénovations d'ampleur aidées par l'Anah en 2024 [A]
    renovationsAmpleur2024: 91900,
    coutMoyenRenovationAmpleur: 41500,  // € par logement, 2024 (TTC ou HT non précisé : V32301)
    gainConventionnelMWh: 17.1,         // MWh/an/logement, économie conventionnelle estimée (DPE), 2024
    renovationsAmpleur2025: 120306,     // Anah, bilan 2025 [C, relayé par la presse spécialisée] V32302
    // Ademe / Alliance Ville Emploi (Build Up Skills 2) ; France Stratégie-Dares : besoin supplémentaire 2019-2030 [B]
    besoinEtpSupplementaire2030: [170000, 250000],
    // MSA, InfoStat installations en 2024 (lu dans le PDF) [A]
    installations2024: 12661, installations2024Moins40: 8967,
    // Départs : 21 000 départs en retraite pour 14 000 installations en 2022 [C, relayé] V32305
    departsAgricolesParAn: 21000,
    djaMoyenne: 32470,                  // € (2021) [C, relayé] V32306
    djaInstallationsAideesParAn: 5300,  // Cour des comptes 2023 [B, relayé] V32306
    // Aide au poste des ateliers et chantiers d'insertion (ACI), montant socle par ETP [A, arrêtés relayés] V32307
    aideAuPosteACI2025: 23921, aideAuPosteACI2026: 24203,
    // Crous : coût de production moyen d'un repas en 2025, rapporteur spécial (AN, commission des finances, 02/07/2026) [B]
    coutRepasCrous2025: 7.89, tarifsCrous: [1.0, 3.30],
    // AMF, enquête 2020 : coût complet d'un repas de cantine scolaire 7,63 €, dont 2,78 € de denrées [C, relayé] V32310
    coutRepasCantineAMF2020: 7.63, denreesCantineAMF2020: 2.78,
    // Restos du cœur, exercice 2024-2025 : 161 M repas, 1,3 M personnes [C, auto-déclaré] V32312
    repasRestos: 161e6, personnesRestos: 1.3e6,
    // TVA : 10 % (CGI art. 279 n ; BOI-TVA-LIQ-30-10-10-20241009) ; 5,5 % si le conditionnement permet la conservation [A]
    tvaConsommationImmediate: 0.10, tvaConservable: 0.055
  };

  /* ---------------- Hypothèses par scénario (methode.md § 3) ---------------- */
  var P = {
    // --- Bâtisseurs ---
    etpParRenovation: { favorable: 0.28, central: 0.35, defavorable: 0.45 },       // H5 : années-ETP par rénovation d'ampleur
    dureeMois: { favorable: 12, central: 18, defavorable: 24 },                    // H7
    remunMensuelle: { favorable: 1800, central: 2100, defavorable: 2400 },         // H8 : coût employeur (≈ Smic)
    stagiairesParEncadrant: { favorable: 10, central: 8, defavorable: 6 },         // H9
    coutEncadrant: { favorable: 55000, central: 60000, defavorable: 65000 },       // H9 : €/an chargé
    pedagogieAn: { favorable: 3000, central: 4000, defavorable: 6000 },            // H10 : centre de formation
    equipementAn: { favorable: 1500, central: 2000, defavorable: 3000 },           // H10 : outillage, assurance, EPI
    fraisStructure: { favorable: 0.10, central: 0.15, defavorable: 0.20 },         // H11
    productiviteApprenti: { favorable: 0.5, central: 0.4, defavorable: 0.25 },     // H12 : part de la production d'un pro
    valeurMainOeuvreEtp: { favorable: 60000, central: 55000, defavorable: 50000 }, // H13 : € de travaux (main-d'œuvre) par ETP-an
    tauxMaintien: { favorable: 0.7, central: 0.6, defavorable: 0.45 },             // H14 : formés encore dans la rénovation à 1 an
    attritionAn: { favorable: 0.05, central: 0.08, defavorable: 0.12 },            // H15 : départs annuels du métier ensuite
    realisationEconomies: { favorable: 0.7, central: 0.5, defavorable: 0.3 },      // H16 : économie réelle / conventionnelle
    prixKWh: 0.15,                                                                 // H17 : € TTC (loyer-energie H3, pondéré)
    // --- Agriculture ---
    agriDureeMois: { favorable: 9, central: 12, defavorable: 12 },                 // H20 : BPREA adulte
    agriPedagogie: { favorable: 5000, central: 7000, defavorable: 9000 },          // H21
    agriTutorat: { favorable: 3000, central: 4000, defavorable: 6000 },            // H22 : stage-parrainage chez un paysan
    agriAccompagnementAn: { favorable: 2000, central: 3000, defavorable: 4000 },   // H23 : 3 ans après installation
    agriTauxInstallation: { favorable: 0.75, central: 0.6, defavorable: 0.45 },    // H24 : formés qui s'installent
    // --- Repas ---
    denrees: { favorable: 2.6, central: 3.0, defavorable: 3.6 },                   // H30 : € HT, entrée-plat-dessert bio, portion adulte
    repasParEtpJour: { favorable: 90, central: 70, defavorable: 50 },              // H31 : productivité avec salariés en insertion
    coutEtpInsertion: { favorable: 23000, central: 25200, defavorable: 27000 },    // H32 : €/an chargé
    insertionParEncadrant: { favorable: 8, central: 6, defavorable: 5 },           // H33
    coutEncadrantCuisine: { favorable: 50000, central: 55000, defavorable: 60000 },
    vente: { favorable: 0.5, central: 0.8, defavorable: 1.2 },                     // H34 : € par repas, comptoirs de retrait
    energie: { favorable: 0.3, central: 0.4, defavorable: 0.5 },                   // H35
    emballage: { favorable: 0.2, central: 0.3, defavorable: 0.45 },                // H36 : contenant consigné et lavage
    investFixe: { favorable: 1.0e6, central: 1.5e6, defavorable: 2.0e6 },          // H37 : € (bâtiment minimal, légumerie, laverie)
    investParRepasJour: { favorable: 1000, central: 1200, defavorable: 1500 },     // H37 : € par repas/jour de capacité
    etpFixes: { favorable: 3, central: 4, defavorable: 5 },                        // H37 bis : direction, qualité-diététique, gestion
    dureeAmort: { favorable: 25, central: 20, defavorable: 15 },
    tauxInteret: { favorable: 0.02, central: 0.03, defavorable: 0.04 },
    fraisGeneraux: { favorable: 0.06, central: 0.08, defavorable: 0.10 },
    remplissage: { favorable: 0.85, central: 0.75, defavorable: 0.6 },              // H38
    joursAn: 300,
    partAuRsaSinon: { favorable: 0.6, central: 0.5, defavorable: 0.3 },            // H39
    rsaAnnuel: 646 * 12                                                            // H39 ⚠️ V32313
  };

  function val(param, s) { return (param !== null && typeof param === 'object') ? param[s] : param; }

  /* ================= 1. Bâtisseurs ================= */

  /** Nombre de logements par périmètre ('FG' ou 'EFG'), résidences principales. */
  function logementsCibles(perimetre) {
    var p = D.partsClasses, n = D.residencesPrincipales;
    return perimetre === 'EFG' ? n * (p.E + p.F + p.G) : n * (p.F + p.G);
  }

  /** Rénovations par an pour traiter un stock en `annees` (sans compter les sorties sans travaux ni les démolitions). */
  function renovationsParAn(stock, annees) { return stock / annees; }

  /** ETP de rénovation d'ampleur nécessaires pour un rythme donné. */
  function etpNecessaires(renovAn, s) { return renovAn * val(P.etpParRenovation, s); }

  /** Coût d'une formation payée sur chantier-école, par personne formée (€). */
  function coutFormationBatisseur(s) {
    var annees = val(P.dureeMois, s) / 12;
    var remun = val(P.remunMensuelle, s) * 12;
    var encadrement = val(P.coutEncadrant, s) / val(P.stagiairesParEncadrant, s);
    var direct = remun + encadrement + val(P.pedagogieAn, s) + val(P.equipementAn, s);
    var parAn = direct * (1 + val(P.fraisStructure, s));
    var brut = parAn * annees;
    // valeur des travaux réalisés pendant la formation (sur leur chantier ou celui de la promotion)
    var valeurTravaux = val(P.productiviteApprenti, s) * val(P.valeurMainOeuvreEtp, s) * annees;
    var renovEquivalentes = val(P.productiviteApprenti, s) * annees / val(P.etpParRenovation, s);
    return {
      annees: annees, parAn: parAn, brut: brut, valeurTravaux: valeurTravaux, net: brut - valeurTravaux,
      remunPart: remun * annees * (1 + val(P.fraisStructure, s)) / brut,
      renovEquivalentes: renovEquivalentes
    };
  }

  /** Professionnels encore en poste `ans` années après le début, pour N formés par an (régime de flux constant). */
  function stockProfessionnels(N, ans, s) {
    var r = val(P.tauxMaintien, s), a = val(P.attritionAn, s), d = Math.ceil(val(P.dureeMois, s) / 12), stock = 0;
    for (var k = 0; k < ans - d; k++) stock += N * r * Math.pow(1 - a, k);  // cohortes sorties de formation
    return stock;
  }

  /** Nombre de jeunes à former par an pour combler `manque` ETP en `ans` années. */
  function formesParAnPourCombler(manque, ans, s) {
    var unitaire = stockProfessionnels(1, ans, s);
    return unitaire > 0 ? manque / unitaire : Infinity;
  }

  /** Programme : N formés par an. Coût annuel en régime (€), emplois, ce que ça rapporte. */
  function programmeBatisseurs(N, s) {
    var c = coutFormationBatisseur(s);
    var economieParRenov = D.gainConventionnelMWh * 1000 * val(P.realisationEconomies, s) * P.prixKWh;
    return {
      N: N, coutBrutAn: N * c.brut, valeurTravauxAn: N * c.valeurTravaux, coutNetAn: N * c.net,
      stagiairesEnFormation: N * c.annees,
      encadrants: N * c.annees / val(P.stagiairesParEncadrant, s),
      renovEquivalentesAn: N * c.renovEquivalentes,
      pros10ans: stockProfessionnels(N, 10, s),
      renovAnParLesPros10ans: stockProfessionnels(N, 10, s) / val(P.etpParRenovation, s),
      economieParRenovAn: economieParRenov
    };
  }

  /** Tableau besoins : horizons 10 / 20 / 30 ans, périmètres FG et EFG. */
  function besoinsRenovation(s) {
    var etpActuels = D.renovationsAmpleur2024 * val(P.etpParRenovation, s);
    var out = [];
    ['FG', 'EFG'].forEach(function (per) {
      [10, 20, 30].forEach(function (h) {
        var stock = logementsCibles(per), ra = renovationsParAn(stock, h), etp = etpNecessaires(ra, s);
        var manque = Math.max(0, etp - etpActuels);
        out.push({ perimetre: per, horizon: h, stock: stock, renovAn: ra, multipleRythme2024: ra / D.renovationsAmpleur2024,
          etp: etp, etpActuels: etpActuels, manque: manque,
          formesParAn: formesParAnPourCombler(manque, Math.min(h, 10), s),
          coutTravauxAnMd: ra * D.coutMoyenRenovationAmpleur / 1e9 });
      });
    });
    return out;
  }

  /* ================= 1 bis. Agriculture ================= */

  function coutInstallationAgricole(s) {
    var annees = val(P.agriDureeMois, s) / 12;
    var formation = annees * (val(P.remunMensuelle, s) * 12) + val(P.agriPedagogie, s) + val(P.agriTutorat, s);
    var accompagnement = 3 * val(P.agriAccompagnementAn, s);
    var parForme = formation + accompagnement * val(P.agriTauxInstallation, s);
    return { parForme: parForme, parInstalle: parForme / val(P.agriTauxInstallation, s), dja: D.djaMoyenne,
      parInstalleAvecDja: parForme / val(P.agriTauxInstallation, s) + D.djaMoyenne };
  }

  function programmeAgricole(installationsSupp, s) {
    var c = coutInstallationAgricole(s);
    return { installationsSupp: installationsSupp, formesParAn: installationsSupp / val(P.agriTauxInstallation, s),
      coutAnHorsDja: installationsSupp * c.parInstalle, coutAnAvecDja: installationsSupp * c.parInstalleAvecDja,
      ecartDepartsInstallations: D.departsAgricolesParAn - D.installations2024 };
  }

  /* ================= 2. Repas à prix coûtant ================= */

  function annuite(capital, taux, n) { return taux === 0 ? capital / n : capital * taux / (1 - Math.pow(1 + taux, -n)); }

  /** Coût de revient d'un repas (€ HT) pour une cuisine de `capacite` repas/jour, détail par poste. */
  function coutRevientRepas(capacite, s, opts) {
    opts = opts || {};
    var repasAn = capacite * val(P.remplissage, s) * P.joursAn;
    var etpProd = capacite * val(P.remplissage, s) / val(P.repasParEtpJour, s);
    var insertion = etpProd * (1 - 1 / (1 + val(P.insertionParEncadrant, s)));
    var encadrants = etpProd - insertion + insertion / 24;          // + un accompagnateur socio-professionnel pour 24
    var personnel = insertion * val(P.coutEtpInsertion, s) + (encadrants + val(P.etpFixes, s)) * val(P.coutEncadrantCuisine, s);
    var invest = val(P.investFixe, s) + capacite * val(P.investParRepasJour, s);
    var amort = annuite(invest, val(P.tauxInteret, s), val(P.dureeAmort, s));
    var postes = {
      denrees: val(P.denrees, s), personnel: personnel / repasAn, vente: val(P.vente, s),
      energie: val(P.energie, s), emballage: val(P.emballage, s), amortissement: amort / repasAn
    };
    var direct = 0; for (var k in postes) direct += postes[k];
    var ht = direct * (1 + val(P.fraisGeneraux, s));
    var aide = opts.sansAideAuPoste ? 0 : insertion * D.aideAuPosteACI2026 / repasAn;
    var tva = opts.tva !== undefined ? opts.tva : D.tvaConsommationImmediate;
    return {
      capacite: capacite, repasAn: repasAn, insertion: insertion, encadrants: encadrants + val(P.etpFixes, s), invest: invest,
      postes: postes, coutHT: ht, aideAuPosteParRepas: aide,
      prixTTC: (ht - aide) * (1 + tva), prixTTCsansAide: ht * (1 + tva), tva: tva,
      tvaCollecteeParRepas: (ht - aide) * tva
    };
  }

  /** Capacité minimale (repas/jour) pour que le prix TTC passe sous `cible`. */
  function capaciteMinPourPrix(cible, s, opts) {
    for (var c = 100; c <= 20000; c += 50) if (coutRevientRepas(c, s, opts).prixTTC <= cible) return c;
    return null;
  }

  /** Repas à vendre pour amortir l'investissement si l'on vend au prix `prixHT` (contribution = prix − coût hors amortissement). */
  function repasPourAmortir(capacite, prixHT, s) {
    var r = coutRevientRepas(capacite, s);
    var horsAmort = r.coutHT - r.postes.amortissement * (1 + val(P.fraisGeneraux, s)) - r.aideAuPosteParRepas;
    var contribution = prixHT - horsAmort;
    return contribution > 0 ? { repas: r.invest / contribution, annees: r.invest / contribution / r.repasAn } : null;
  }

  /** Coût public net annuel d'un réseau de `nb` cuisines (€). Convention : investissement porté par l'entreprise et payé par les clients. */
  function coutPublicRepas(nb, capacite, s) {
    var r = coutRevientRepas(capacite, s);
    var aide = nb * r.insertion * D.aideAuPosteACI2026;
    var tva = nb * r.repasAn * r.tvaCollecteeParRepas;
    var rsaEvite = nb * r.insertion * val(P.partAuRsaSinon, s) * P.rsaAnnuel;
    return { repasAn: nb * r.repasAn, insertion: nb * r.insertion, encadrants: nb * r.encadrants, invest: nb * r.invest,
      aideAuPoste: aide, tvaCollectee: tva, rsaEvite: rsaEvite, netHorsTva: aide - rsaEvite, netAvecTva: aide - rsaEvite - tva };
  }

  /** Comparaison : subvention publique par repas dans l'existant (Crous) et dans la mesure. */
  function comparaisonRepas(s) {
    var r = coutRevientRepas(3000, s);
    return {
      crous1: D.coutRepasCrous2025 - D.tarifsCrous[0], crous330: D.coutRepasCrous2025 - D.tarifsCrous[1],
      mesure: r.aideAuPosteParRepas, prixMesure: r.prixTTC, coutCrous: D.coutRepasCrous2025, coutCantine: D.coutRepasCantineAMF2020
    };
  }

  var api = {
    SCENARIOS: SCENARIOS, D: D, P: P, val: val,
    logementsCibles: logementsCibles, renovationsParAn: renovationsParAn, etpNecessaires: etpNecessaires,
    coutFormationBatisseur: coutFormationBatisseur, stockProfessionnels: stockProfessionnels,
    formesParAnPourCombler: formesParAnPourCombler, programmeBatisseurs: programmeBatisseurs, besoinsRenovation: besoinsRenovation,
    coutInstallationAgricole: coutInstallationAgricole, programmeAgricole: programmeAgricole,
    annuite: annuite, coutRevientRepas: coutRevientRepas, capaciteMinPourPrix: capaciteMinPourPrix,
    repasPourAmortir: repasPourAmortir, coutPublicRepas: coutPublicRepas, comparaisonRepas: comparaisonRepas
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BatisseursRepas = api;
})(this);
