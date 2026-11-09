/*
 * modeles/systeme-ideal/base_0611.js — BASE DE TRAVAIL du 06/11/2026 (choix de l'auteur : la v7.5 sert de base de travail), NON ADOPTÉE, rien n'est figé.
 *
 * Couche posée sur la v7.4 B corrigée (bilan_global.py : lignes G05-G12 + couche CORR_T65, solde de croisière −67,33 Md€) ; ne modifie AUCUN module existant.
 * Contenu :
 *   (1) les lignes de la base de travail (Md€/an, central, croisière ; bas / central / haut = ampleur de l'effet, « bas » = effet le plus favorable au solde sauf mention) :
 *       v7.5 de la fonction du patrimoine (decisions_0611_v75.js, variante recommandée) à la place de G05 ; exonération des intérêts de l'épargne réglementée dans la
 *       fonction des revenus ; C09 (taxe d'habitation des résidences secondaires fondue dans la v7.5, logements vacants gardés) ; arbitrage 49 (Sécurité sociale à 100 %
 *       sur le socle) ; arbitrage 50 (fin des titres spéciaux, TVA de la restauration à 5 %, contradiction avec N10 levée) ; arbitrage 48 (formation, variante B = C24) ;
 *       fantômes du grand livre (completude.md) : déjà dans le solde ou non ;
 *   (2) les cas types de revenus avec le coût employeur d'OpenFisca (correction de l'anomalie du cadre à 10 000 / 20 000 € brut, voir casTypesCorriges) ;
 *   (3) trois jeux de réglages pour une dette stable en macro de référence (avec la combinaison R1f + M1m + M2m + M3) : (a) fonction des revenus seule,
 *       (b) fonction du patrimoine en haut seule (t∞, K), (c) mix + économies publiques chiffrées. PRÉSENTÉS, NON ADOPTÉS : l'auteur choisira.
 * Hypothèses HB1 à HB12 (bilan global, document de travail non publié, § 000) ; vérifications V17700 à V17799.
 * Charger (jsc) : la liste de test_decisions_0611_v75.js sans le test, puis ce fichier (ordre complet en tête de test_base_0611.js).
 */
(function (root) {
  'use strict';
  var A = root.Decisions0611V74, V5 = root.Decisions0611V75, V = root.BaremeUniqueV6, X = root.BaremeV71, I = root.Decisions0511i;
  var PIB = 2935.0;

  // ======================================================================================================================================
  // 0. Données sourcées
  // ======================================================================================================================================
  var S = {
    corrT65: 8.885 - (4.6 - 3.944) - 27.204,       // couche CORR_T65 de bilan_global.py (C01-C03 + C10) : −18,975
    soldeV74: -48.35022955065026,                  // v7.4 B, croisière 2060 (bilan_global.py, export_bilan_v74.js)
    poV74Corr: null,                               // renseigné par bilan_global.py (contrôle)
    g05v74: 54.516184765378696,                    // recette de la fonction du patrimoine v7.4 B (G05)
    // épargne réglementée : encours (CDC) ; taux (info.gouv, relevés dans sources/recherche-euro-francais.md § 2.4)
    laLdds2024: 603.1, lep2025: 80.9,              // Md€ : Livret A + LDDS fin 2024 ; LEP fin novembre 2025 (CDC, collecte de novembre 2025)
    tauxLA2024: 0.030, tauxLEP2024: 0.040,         // 2024 : Livret A 3 % (01/02/2023-31/01/2025), LEP 4 % (01/02/2024-31/01/2025) ⚠️ V17701
    tauxLA2026: 0.017, tauxLEP2026: 0.027,         // 01/08/2026 : Livret A 1,7 % ; LEP = Livret A + 1 point (règle constatée en 2025-2026) ⚠️ V17701
    // C09 : taxe d'habitation des résidences secondaires et des logements vacants (GL-REC-063, Insee 3.217) ; partage SDES 2024 (TH RS 3,723 ; vacants 0,426)
    thrsVac: 3.153, sdesThrs: 3.723, sdesVac: 0.426,
    // arbitrage 49 : sources/assurances-dossier.md (DREES, HCAAM) ; completude.md F12 (TSA 6,170, Insee 3.217) ; instances.csv INS-SS-013 (C2S 2,959, DREES 2024)
    hcaamAMO: 18.8, indexCSBM: 255 / 208, prestAMC: 33.0, tsa: 6.170, c2s: 2.959, gestionAMO: [0.8, 1.15, 1.5], gestionAMCevitee: [5.2, 6.1, 7.0],
    cotisAMC: 46.5, couverts: 62e6,               // cotisations HT des complémentaires (ACPR, DREES) ; personnes couvertes ≈ 96 % de 65 M (HB7, ⚠️ V17707)
    santePrevEntreprise: 23.8,                     // PLFSS 2026, annexe 4 : assiette exemptée « santé et prévoyance complémentaire » 2024 (p), Md€
    // arbitrage 50 : PLFSS 2026, annexe 4 (assiettes exemptées 2024 p : titres-restaurant 5,5 ; chèques-vacances 1,1 ; CESU préfinancé 0,2) ; Voies et moyens 2026 (730221)
    titres: { restaurant: 5.5, vacances: 1.1, cesu: 0.2 }, ceAvantages: 4.8,
    dfRestauration2026: 2.275,                     // Md€, dépense fiscale 730221 (taux de 10 % au lieu de 20 %), 2026 prévu
    consoRestaurants2024: 48.7484,                 // Md€ TTC, Insee, consommation effective des ménages par fonction, CP1111 « Restaurants, cafés et similaires », 2024
    n10Restauration: 2.28 * 4.7 / (2.28 + 2.47),   // part « restauration » de N10 (4,7 = restauration 2,28 + travaux 2,47, economies-depense-publique.md § T) : 2,256
    // arbitrage 48 : C24 (corrections-bilan.md) : coût par rapport au bilan corrigé
    c24: [1.954, 2.334, 2.974],
    // fantômes (completude.md) : chambres consulaires F10 ; taxes additionnelles au foncier F9 (GEMAPI 0,532, TSE et autres 0,724)
    consulaires: 1.271, gemapiTse: 0.532 + 0.724,
    // économies publiques chiffrées non comptées (instances.csv : missions terminées, cote A)
    solideo: 0.3683, cojo: 0.0750,
    // PO élargis (economies-cachees-et-transition.md § 6.1) : notaires 9,8 (2021) ; greffes 0,2245 (2015) ; annonces 0,193 ; part des contrats collectifs : 50 à 100 % (central 75 %, HB10)
    notaires: 9.8, greffes: 0.2245, annonces: 0.193, partCollectifs: [0.5, 0.75, 1.0], notairesApres: -0.3, greffesAnnoncesApres: -0.2,
    // v7.5 (resultats_decisions_0611_v75.txt) : variante recommandée
    v75: { regime: 'RP', X: 1e6, tInf: 0.03, K: 4e5, payeProrata: true, plancherPro: true }
  };
  var HYP = {
    // HB1 : taux moyen de l'épargne réglementée en croisière : bas = taux du 01/08/2026, haut = taux de 2024, central = milieu
    // HB2 : taux marginal de la fonction des revenus sur ces intérêts (T'(R) moyen des détenteurs) : bas 0,42 (premier quartile) ; central 0,52 (quartiles à poids égaux) ; haut 0,58 (pondéré vers le haut)
    tMarginalEpargne: [0.42, 0.52, 0.58],
    // HB3 : TH des logements vacants gardée (taxe incitative), part SDES 0,426 / (3,723 + 0,426)
    // HB4 : coût public de la Sécurité sociale à 100 % : HCAAM 18,8 (2019-2020) indexé sur la CSBM (255 / 208) ; bas = non indexé ; haut = +10 %
    // HB5 : la TSA suit les prestations transférées (23,05 / 33)
    // HB6 : participation des employeurs à la complémentaire santé : déjà dans la base R (coût employeur) au central ; haut = convertie en salaire hors de R, taxée au marginal
    partSanteDansSantePrev: 0.55, tMarginalSalaires: [0.25, 0.50, 0.58],
    // HB8 : titres spéciaux : conversion en salaire (taxée au marginal) ou bénéfice (IS 25 %) : bas 0,25 ; central 0,50 ; haut 0,60
    tTitres: [0.25, 0.50, 0.60],
    // HB9 : TVA de la restauration : bas = base de la dépense fiscale ; central = base Insee (consommation des ménages hors alcool, 15 % ⚠️) ; haut = central + 20 % (non-résidents)
    partAlcool: 0.15, tvaCible: 0.05,
    // HB11 : chambres consulaires : taxe gardée au central (aucune décision) ; haut = taxe supprimée, missions de service public reprises à 50 % du budget (0,64)
    // HB12 : taxes additionnelles au foncier (GEMAPI, TSE) : leur base (taxe foncière, TH) disparaît avec la v7.5 ; central = trou entier, bas = taux additionnel sur la part RP de la v7.5 (0)
    plafondCasLimites: 1.0
  };

  // ======================================================================================================================================
  // 1. Lignes de la base de travail
  // ======================================================================================================================================
  function trois(f) { return [f(0), f(1), f(2)]; }
  function fr(x, n) { return x.toFixed(n === undefined ? 2 : n).replace('.', ','); }
  function epargne() {
    var tm = function (la, lep) { return S.laLdds2024 * la + S.lep2025 * lep; };
    var interets = [tm(S.tauxLA2026, S.tauxLEP2026), tm((S.tauxLA2024 + S.tauxLA2026) / 2, (S.tauxLEP2024 + S.tauxLEP2026) / 2), tm(S.tauxLA2024, S.tauxLEP2024)];
    return { interets: interets, cout: trois(function (k) { return interets[k] * HYP.tMarginalEpargne[k]; }) };
  }
  var _v75 = null;
  function v75() {
    if (_v75) return _v75;
    var r = V5.recette(S.v75);
    _v75 = { recette: r.totale, delta: r.totale - S.g05v74, differe: r.differe, encaisse: r.totale - r.differe, bouclierAn1: r.bouclierAn1, rp: r.rpNette, fonction: r.fonctionNette };
    return _v75;
  }
  function restauration() {
    var parPointDF = S.dfRestauration2026 / 10, baseInsee = S.consoRestaurants2024 * (1 - HYP.partAlcool) / 1.10, parPointInsee = baseInsee / 100, pts = 100 * (0.10 - HYP.tvaCible);
    return { parPointDF: parPointDF, baseInseeHT: baseInsee, parPointInsee: parPointInsee, cout: [parPointDF * pts, parPointInsee * pts, parPointInsee * pts * 1.2] };
  }
  /** Lignes : écart au SOLDE (+ améliore), Md€/an ; v = [bas, central, haut] où « bas » est le cas le plus favorable au solde ; d_dep / d_po / d_hors au central. */
  function lignes() {
    var e = epargne(), v = v75(), r = restauration(), amo = S.hcaamAMO * S.indexCSBM, partVac = S.sdesVac / (S.sdesThrs + S.sdesVac), thVac = S.thrsVac * partVac;
    var tsaPerdue = S.tsa * amo / S.prestAMC, titres = S.titres.restaurant + S.titres.vacances + S.titres.cesu;
    var L = [
      { id: 'BT01', groupe: 'patrimoine', poste: 'Fonction du patrimoine v7.5 (RP à 0,25 % jusqu\'à 1 M€ par ménage avec bouclier ; P(W) = 3 % × W²/(W + 400 000 €) sur le reste ; impôt plancher élargi ; part sur actifs mobilisables payée en titres) à la place de G05 (54,52)',
        v: [v.delta, v.delta, v.delta], sens: 'po', cote: 'B', nature: 'calcul (decisions_0611_v75.js, chaîne de comportement de la v7.4)', statut: 'base de travail (06/11)',
        note: 'recette ' + fr(v.recette) + ' ; différé ' + fr(v.differe, 1) + ' (encaissé dans l\'année ' + fr(v.encaisse, 1) + ') ; bouclier de transition l\'année 1 : −' + fr(v.bouclierAn1, 1) + ' (hors croisière) ; bas et haut non calculés par le module (même valeur) ⚠️ V16902' },
      { id: 'BT02', groupe: 'revenus', poste: 'Intérêts de l\'épargne réglementée (Livret A, LDDS, LEP, dans les plafonds) exonérés de la fonction des revenus',
        v: [-e.cout[0], -e.cout[1], -e.cout[2]], sens: 'po', cote: 'B', nature: 'estimation (HB1, HB2) : intérêts ' + e.interets.map(function (x) { return fr(x, 1); }).join(' / ') + ' Md€ × taux marginal ' + HYP.tMarginalEpargne.map(function (x) { return fr(x); }).join(' / '),
        statut: 'base de travail (06/11)', note: 'les 71,7 Md€ d\'intérêts de la base capital du modèle (modele.js, capitalCourant) comprennent ces intérêts : la v7.2 les taxe (HQ12) ; encours CDC fin 2024 (603,1) et LEP (80,9, nov. 2025) ⚠️ V17700, V17701' },
      { id: 'BT03', groupe: 'patrimoine', poste: 'C09 : taxe d\'habitation des résidences secondaires fondue dans la v7.5 (la recette de BT01 la remplace déjà) ; taxe sur les logements vacants gardée',
        v: [-(S.thrsVac - thVac), -(S.thrsVac - thVac), -S.thrsVac], sens: 'po', cote: 'A/B', nature: 'fait (3,153, GL-REC-063) ; partage SDES 2024 appliqué (HB3)', statut: 'base de travail (06/11)',
        note: 'vacants gardés ' + fr(thVac) + ' ; haut : vacants fondus aussi ⚠️ V16907, V17702' },
      { id: 'BT04', groupe: 'santé', poste: 'Arbitrage 49 : Sécurité sociale à 100 % sur le socle (panier opposable), dépense publique supplémentaire',
        v: [-S.hcaamAMO, -amo, -amo * 1.1], sens: 'dep', cote: 'B/C', nature: 'estimation (HB4) : HCAAM 18,8 × CSBM 255 / 208', statut: 'base de travail (06/11)', note: 'assurances-dossier.md § 1.3 ; ≈ 70 % des 33 Md€ de prestations des complémentaires ⚠️ V17703' },
      { id: 'BT05', groupe: 'santé', poste: 'Arbitrage 49 : taxe de solidarité additionnelle perdue sur les contrats qui disparaissent',
        v: [-S.tsa * S.hcaamAMO / S.prestAMC, -tsaPerdue, -tsaPerdue], sens: 'po', cote: 'B', nature: 'calcul (HB5) : TSA 6,170 × prestations transférées / 33', statut: 'base de travail (06/11)', note: 'completude.md F12 ; recoupe l\'écart HCAAM 22,5 − 18,8 = 3,7 (2019) ⚠️ V17606' },
      { id: 'BT06', groupe: 'santé', poste: 'Arbitrage 49 : gestion supplémentaire de l\'assurance maladie',
        v: [-S.gestionAMO[0], -S.gestionAMO[1], -S.gestionAMO[2]], sens: 'dep', cote: 'C', nature: 'estimation (economies-cachees-et-transition.md § 1.1)', statut: 'base de travail (06/11)', note: 'la gestion évitée des complémentaires (5,2 / 6,1 / 7,0) est PRIVÉE : hors solde public, comptée dans les PO élargis' },
      { id: 'BT07', groupe: 'santé', poste: 'Arbitrage 49 : complémentaire santé solidaire (C2S) devenue inutile, dépense redéployée',
        v: [S.c2s, S.c2s, S.c2s], sens: 'dep', cote: 'A', nature: 'fait (DREES 2024, instances.csv INS-SS-013)', statut: 'base de travail (06/11)', note: 'les autres « aides » des ≈ 10 Md€ (exonérations fiscales et sociales des contrats) disparaissent déjà avec l\'impôt sur le revenu et les cotisations (v7.2) : rien de plus à compter ⚠️ V17004' },
      { id: 'BT08', groupe: 'santé', poste: 'Arbitrage 49 : participation des employeurs à la complémentaire santé convertie en salaire (si elle est hors de la base R)',
        v: [S.santePrevEntreprise * HYP.partSanteDansSantePrev * HYP.tMarginalSalaires[2], 0, 0], sens: 'po', cote: 'C', nature: 'hypothèse (HB6) : 0 au central (déjà dans R ?) ; favorable : 23,8 × 55 % × 0,58', statut: 'à vérifier', note: 'PLFSS 2026 annexe 4 (assiette santé et prévoyance 23,8) ; contenu de la table T14 non lu ⚠️ V16515, V17704' },
      { id: 'BT09', groupe: 'titres', poste: 'Arbitrage 50 : fin des titres-restaurant, chèques-vacances et CESU préfinancés (plus d\'exemption : la part employeur devient salaire ou bénéfice)',
        v: [titres * HYP.tTitres[2], titres * HYP.tTitres[1], titres * HYP.tTitres[0]], sens: 'po', cote: 'A/C', nature: 'fait (assiettes PLFSS 2026 annexe 4 : 5,5 + 1,1 + 0,2) × hypothèse HB8', statut: 'base de travail (06/11)',
        note: 'droit actuel : 2,66 Md€ pour les seuls titres-restaurant (IR 0,555 + cotisations 2,1) ; avantages des CSE (4,8, chèques culture et cadeaux compris) non isolés : non comptés ⚠️ V17705' },
      { id: 'BT10', groupe: 'titres', poste: 'Arbitrage 50 : TVA de la restauration de 10 % à 5 % (plancher de la directive, art. 98)',
        v: [-r.cout[0], -r.cout[1], -r.cout[2]], sens: 'po', cote: 'A/B', nature: 'calcul (HB9) : ' + fr(r.parPointDF, 3) + ' (dépense fiscale) / ' + fr(r.parPointInsee, 3) + ' Md€ par point (Insee, base HT ' + fr(r.baseInseeHT, 1) + ')', statut: 'base de travail (06/11)',
        note: 'V17109 : la dépense fiscale suppose une base HT de 22,75 Md€ ; la consommation des ménages en restaurants et cafés est de 48,7 Md€ TTC en 2024 (Insee) : la base du Voies et moyens paraît basse ; 5,5 % : × 0,9 ⚠️ V17706' },
      { id: 'BT11', groupe: 'titres', poste: 'Arbitrage 50 : contradiction avec N10 levée (la recette « restauration remise à 20 % » de N10 est retirée)',
        v: [-S.n10Restauration, -S.n10Restauration, -S.n10Restauration], sens: 'po', cote: 'B', nature: 'calcul : 4,7 × 2,28 / (2,28 + 2,47)', statut: 'base de travail (06/11)',
        note: 'N10 = 4,7 − 1,0 ; la part « travaux » restante (1,44) suppose une TVA des travaux en partie remise à 20 % alors que la décision 4 la garde à 10 % : incohérence signalée, non corrigée ⚠️ V17708' },
      { id: 'BT12', groupe: 'formation', poste: 'Arbitrage 48 : formation, un seul organisme (variante B, C24 : aide à l\'apprentissage gardée et ciblée)',
        v: [-S.c24[0], -S.c24[1], -S.c24[2]], sens: 'dep', cote: 'B', nature: 'estimation (formation-professionnelle-cartographie.md § variantes)', statut: 'base de travail (06/11)', note: 'par rapport au bilan corrigé (D15 en base 2024) ; détails à valider avec le chapitre éducation' },
      { id: 'BT13', groupe: 'fantômes', poste: 'Fantômes F9 : GEMAPI et taxes spéciales d\'équipement, additionnelles à la taxe foncière et à la TH, perdent leur base avec la v7.5',
        v: [0, -S.gemapiTse, -S.gemapiTse], sens: 'po', cote: 'A', nature: 'fait (montants, recettes.csv) ; hypothèse HB12', statut: 'pas encore dans le solde', note: 'bas : taux additionnel sur la part RP de la v7.5 ; taxe d\'aménagement et taxe sur les bureaux gardées (autres bases) ⚠️ V17604, V17709' },
      { id: 'BT14', groupe: 'fantômes', poste: 'Fantômes F10 : chambres consulaires (taxes 1,271 gardées dans P11 ; aucune décision)',
        v: [0, 0, -S.consulaires / 2], sens: 'po', cote: 'B', nature: 'hypothèse HB11', statut: 'pas encore dans le solde (décision à prendre)', note: 'recommandation (a) de completude.md : missions de service public reprises par le budget commun, le reste en adhésion volontaire' }
    ];
    L.forEach(function (l) { l.central = l.v[1]; });
    return L;
  }
  /** Fantômes déjà dans le solde (rien à ajouter) : liste pour la traçabilité. */
  var FANTOMES_DANS_LE_SOLDE = [
    { ref: 'F7', poste: 'Versement mobilité (12,244) et autorités de la mobilité', ou: 'recette supprimée en P06 ; dépenses des AOM et d\'IDFM « reste » ; gratuité urbaine D31', reste: 'affectation seulement : la part de 1,2 % de la fonction des revenus doit rendre 12,244 + la gratuité (V17602)' },
    { ref: 'F8', poste: 'Compensation des départements et des régions (DMTO 14,742, CVAE)', ou: 'DMTO supprimés en F07, CVAE en P06 ; dépenses des départements et régions « reste »', reste: 'transfert interne aux APU (dotation de péréquation) : nul sur le solde consolidé ; neutralité par échelon non démontrée (V17603)' },
    { ref: 'F2', poste: 'CNSA (CSA 2,468)', ou: 'recette fondue en C10 ; dépense CNSA « reste »', reste: 'ligne « autonomie » du budget commun' },
    { ref: 'F3', poste: 'AGS (1,538)', ou: 'recette fondue en C10 ; dépense dans le total Insee (ODAC, GL-ODAC-099), non isolée', reste: 'mission confiée à l\'assurance chômage (V17600)' },
    { ref: 'F4', poste: 'Action Logement (PEEC 1,504, FNAL 2,935)', ou: 'recettes fondues en C10 ; dépenses « reste » (ANRU, aides aux salariés)', reste: 'reprise par le budget commun' },
    { ref: 'F12', poste: 'TSA des complémentaires (6,170)', ou: 'traitée en BT05 (part perdue avec l\'arbitrage 49)', reste: '—' }
  ];
  function totaux(L) {
    L = L || lignes(); var t = { bas: 0, central: 0, haut: 0, d_po: 0, d_dep: 0 };
    L.forEach(function (l) { t.bas += l.v[0]; t.central += l.v[1]; t.haut += l.v[2]; if (l.sens === 'po') t.d_po += l.v[1]; else t.d_dep -= l.v[1]; });
    return t;
  }

  // ======================================================================================================================================
  // 2. Dette : effet constant dès 2029 (même convention que la couche corrigée d'export_bilan_v74.js : ordre de grandeur)
  // ======================================================================================================================================
  function lvComb() { return root.Decisions0611V72.leviers(A.HYP.combinaison); }
  function dette(effet) {
    var lc = lvComb(), out = { effet: effet, dette: {}, economies: {}, manque: {}, detteComb: {} };
    A.MACROS.forEach(function (m) {
      var lev = function (s, y) { return S.corrT65 + effet; }, levC = function (s, y) { return lc(s, y) + S.corrT65 + effet; };
      var j = A.jalons('central', m, lev); out.dette[m] = [j.r0, j.r10, j.r20, j.r30];
      out.economies[m] = A.besoin('central', m, lev); out.manque[m] = A.besoin('central', m, levC);
      var jc = A.jalons('central', m, levC); out.detteComb[m] = [jc.r10, jc.r20, jc.r30];
    });
    return out;
  }

  // ======================================================================================================================================
  // 3. Cas types de revenus corrigés : coût employeur d'OpenFisca (superBrut) au lieu de l'approximation H453 (correctifs.js, 42 % au-dessus de 3,5 Smic)
  // ======================================================================================================================================
  var OFFICIELS = ['smic_seul', 'parent_isole_smic', 'couple_2smic_0enf', 'couple_2smic_2enf', 'couple_median_2enf', 'cadre_5000', 'cadre_10000', 'cadre_20000'];
  function specOF(id) {
    var o = I.HYP.OF_CAS[id], sp = I.spec(id), n = o.brut.length, sb = o.superBrut, couts = o.brut.map(function (b) { return sb * b / o.brut.reduce(function (a, x) { return a + x; }, 0); });
    return { revenus: couts, enfants: sp.enfants, situation: n === 2 ? 'couple' : (sp.enfants > 0 ? 'parent' : 'seul'), coutsH453: sp.couts };
  }
  function avantOF(id) { return id === 'parent_isole_smic' ? A.casTypesRevenus().filter(function (c) { return c.id === id; })[0].avant : I.HYP.OF_CAS[id].rd; }
  /** Pour un barème q (défaut : celui de la v7.4 B) : avant (OpenFisca), après avec le coût employeur H453 (comme le modèle), après avec le coût employeur OpenFisca (corrigé). */
  function casTypesCorriges(q) {
    var old = JSON.parse(JSON.stringify(A.VARIANTES.B.bareme)); if (q) { A.VARIANTES.B.bareme = q; } A.variante('B');
    var s = A.sched(), R = X.HYP.regle, out = [];
    OFFICIELS.forEach(function (id) {
      var sp = specOF(id), av = avantOF(id), h453 = V.menage(s, { revenus: sp.coutsH453, enfants: sp.enfants, situation: sp.situation }, R).revenu, of = V.menage(s, sp, R).revenu;
      out.push({ id: id, libelle: I.HYP.OF_CAS[id].libelle, coutOF: sp.revenus.reduce(function (a, x) { return a + x; }, 0), coutH453: sp.coutsH453.reduce(function (a, x) { return a + x; }, 0),
                 avant: av, apresH453: h453, apresOF: of, ecartH453: h453 - av, ecartOF: of - av, ecartPctOF: (of - av) / av });
    });
    [1500, 2000, 3000].forEach(function (n) {   // salariés à n € net : seul le brut est connu (NET_ACTUEL) : coût H453 gardé (signalé)
      var o = V.NET_ACTUEL[n], c = I.coutMois(o.brut), ap = V.menage(s, { revenus: [c] }, R).revenu;
      out.push({ id: 'net_' + n, libelle: 'Salarié seul à ' + n + ' € net actuels (coût employeur H453, pas de super-brut OpenFisca)', coutOF: null, coutH453: c, avant: o.rd, apresH453: ap, apresOF: null, ecartH453: ap - o.rd, ecartOF: null, ecartPctOF: null });
    });
    var v0 = V.menage(s, { revenus: [0] }, R).revenu;
    out.push({ id: 'sans_emploi', libelle: 'Personne seule sans revenu (RSA + aide au logement)', coutOF: 0, coutH453: 0, avant: 877, apresH453: v0, apresOF: v0, ecartH453: v0 - 877, ecartOF: v0 - 877, ecartPctOF: (v0 - 877) / 877 });
    A.VARIANTES.B.bareme = old; A.variante('B');
    return out;
  }
  /** Taux de prélèvement marginal du droit actuel (OpenFisca) entre deux cas types, sur la base du coût employeur. */
  function marginalActuel(id1, id2) { var a = I.HYP.OF_CAS[id1], b = I.HYP.OF_CAS[id2]; return 1 - (b.rd - a.rd) / (b.superBrut - a.superBrut); }

  // ======================================================================================================================================
  // 4. Jeux de réglages (PRÉSENTÉS, NON ADOPTÉS)
  // ======================================================================================================================================
  function bisect(f, lo, hi) { for (var k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  var B0 = null;
  function bareme0() { if (!B0) B0 = JSON.parse(JSON.stringify(A.VARIANTES.B.bareme)); return B0; }
  function recetteRevenus(q) { var old = A.VARIANTES.B.bareme; A.VARIANTES.B.bareme = q; A.variante('B'); var e = A.ecart('central').total; A.VARIANTES.B.bareme = old; A.variante('B'); return e; }
  /** (a) Fonction des revenus seule : a (= m∞) relevé, m0 fixe (forme du réglage A de reglage_c10.js). Rend le barème qui rapporte `cible` Md€ de plus (comportements compris). */
  function jeuRevenus(cible) {
    var q0 = bareme0(), e0 = recetteRevenus(q0), mk = function (x) { var q = JSON.parse(JSON.stringify(q0)); q.mInf = x; return q; };
    var a = bisect(function (x) { return recetteRevenus(mk(x)) - e0 - cible; }, q0.mInf, 0.95), q = mk(a);
    return { param: a, bareme: q, recette: recetteRevenus(q) - e0 };
  }
  /** ΔB(R) (€/mois, par adulte) entre deux barèmes. */
  function deltaB(q, pts) { var s0, s1, out = {}; var old = A.VARIANTES.B.bareme;
    A.VARIANTES.B.bareme = bareme0(); A.variante('B'); s0 = A.sched(); var b0 = {}; pts.forEach(function (R) { b0[R] = s0.S - s0.T(R); });
    A.VARIANTES.B.bareme = q; A.variante('B'); s1 = A.sched(); pts.forEach(function (R) { out[R] = (s1.S - s1.T(R)) - b0[R]; });
    A.VARIANTES.B.bareme = old; A.variante('B'); return out; }
  /** (b) Fonction du patrimoine en haut seule : pour t∞ donné, plus petit K (pas de 25 000 €) qui respecte la contrainte dure (tranches ≤ 1 M€), et recette nette. */
  function kMinimal(tInf, X0) {
    var Ks = [], K; for (K = 1e5; K <= 3e6; K += 2.5e4) Ks.push(K);
    for (var i = 0; i < Ks.length; i++) { var c = { regime: 'RP', X: X0 || 1e6, tInf: tInf, K: Ks[i], payeProrata: true, plancherPro: true }; if (V5.contrainte(c).ok) return Ks[i]; }
    return null;
  }
  function jeuPatrimoine(tInf, K) {
    var c = { regime: 'RP', X: 1e6, tInf: tInf, K: K === undefined ? kMinimal(tInf) : K, payeProrata: true, plancherPro: true }, r = V5.recette(c);
    return { c: c, recette: r.totale, delta: r.totale - v75().recette, differe: r.differe, encaisse: r.totale - r.differe, erosion: V5.calage(tInf).erosionTop };
  }
  /** Cas limites (charge payée en % du revenu) sous une configuration de la fonction du patrimoine. */
  function casLimites(c) { return V5.casLimites(c).map(function (x) { return { id: x.id, lib: x.lib, charge: x.v75.chargePct, chargeDue: x.v75.chargeDuePct, paye: x.v75.paye, differe: x.v75.differe }; }); }
  /** Barème du patrimoine (dû brut, avant plancher) pour un patrimoine net hors résidence principale W (€/an). */
  function tablePatrimoine(c, Ws) { return Ws.map(function (W) { var P = V5.Pf(W, c); return { W: W, du: P, taux: W > 0 ? P / W : 0 }; }); }

  // ======================================================================================================================================
  // 5. Prélèvements obligatoires élargis (economies-cachees-et-transition.md § 6.1)
  // ======================================================================================================================================
  function poElargis(poOfficiel, apres) {
    var coll = S.cotisAMC * HYP_PART(), reg = S.notaires + S.greffes + S.annonces;
    if (!apres) return poOfficiel + coll + reg;
    return poOfficiel + 0 + reg + S.notairesApres + S.greffesAnnoncesApres;   // après : plus de contrat collectif obligatoire (arbitrage 49) ; notaires (partie fiscale) et greffes réduits
  }
  function HYP_PART() { return S.partCollectifs[1]; }

  var API = { S: S, HYP: HYP, PIB: PIB, epargne: epargne, v75: v75, restauration: restauration, lignes: lignes, totaux: totaux, FANTOMES_DANS_LE_SOLDE: FANTOMES_DANS_LE_SOLDE,
              dette: dette, casTypesCorriges: casTypesCorriges, marginalActuel: marginalActuel, jeuRevenus: jeuRevenus, recetteRevenus: recetteRevenus, deltaB: deltaB, bareme0: bareme0,
              kMinimal: kMinimal, jeuPatrimoine: jeuPatrimoine, casLimites: casLimites, tablePatrimoine: tablePatrimoine, poElargis: poElargis, OFFICIELS: OFFICIELS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.BaseTravail0611 = API;
})(this);
