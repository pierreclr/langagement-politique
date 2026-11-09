// Produit cas_types.json (futur onglet « mon foyer » du simulateur). Depuis modeles/gagnants-perdants/ :
//   jsc cas_types_donnees.js modele.js exporter.js > cas_types.json
var G = this.GagnantsPerdants || require('./modele.js');
var CAS = this.CAS_TYPES_DONNEES || require('./cas_types_donnees.js');
var out = (typeof print === 'function') ? print : console.log;
function r2(x) { return Math.round(x * 100) / 100; }
var sortie = {
  meta: {
    titre: 'Cas types : revenu disponible actuel et dans le système proposé (€ par mois)',
    tache: 'T14', date: '2026-10-25', modele: 'modeles/gagnants-perdants/modele.js',
    methode_actuel: 'API OpenFisca-France 175.0.45 (législation 2026) + API Urssaf mon-entreprise (coût employeur, cotisations micro) + calculs documentés (CSG des pensions, ARE, droits de succession) : voir donnees/collecte.py et methode.md',
    avertissement: 'Ordres de grandeur statiques : coût employeur, prix et comportements inchangés. Le système à 50 % n\'est pas financé (simulateur : ≈ −196 Md€/an) ; comparer aussi avec les taux 59 % et 63 %.',
    formule_propose: 'socle × adultes + majoration × enfants + (1 − taux) × (coûts employeur + chiffre d\'affaires × (1 − charges) + dividendes + loyers nets) + compléments de retraite (règle au choix) ; chômage, RSA, prime d\'activité, aides au logement, prestations familiales et ASPA supprimés ; AAH conservée'
  },
  parametres_defaut: G.DEFAUT,
  cas: CAS.map(function (c) {
    var res = {};
    [0.5, 0.59, 0.63].forEach(function (t) {
      var x = G.comparer(c, { taux: t });
      res['taux_' + Math.round(t * 100)] = { propose: r2(x.propose), ecart_mois: r2(x.ecartMois), ecart_an: r2(x.ecartAn), ecart_pct: r2(100 * x.ecartPct) };
    });
    var v = {};
    if (c.pensions) {
      v.retraite_net = r2(G.comparer(c, { retraite: 'net' }).ecartMois);
      v.retraite_impose = r2(G.comparer(c, { retraite: 'impose' }).ecartMois);
    }
    if (c.dividendes_annuels) v.is_reverse_en_dividendes = r2(G.comparer(c, { isRepercute: true }).ecartMois);
    var o = {
      id: c.id, libelle: c.libelle,
      composition: { adultes: c.adultes, enfants: c.enfants, logement: c.logement,
                     loyer_mois: c.logement === 'locataire' ? (c.adultes === 1 ? 500 : 650) + 75 * c.enfants : 0 },
      entrees: {
        salaires_bruts_mois: (c.salaires || []).map(function (s) { return s ? r2(s[0]) : 0; }),
        couts_employeur_mois: c.couts_employeur || [],
        chiffre_affaires_mois: c.micro_ca || 0, part_charges_reelles: c.charges_reelles_part || 0,
        pensions_brutes_mois: c.pensions || [], chomage_brut_mois: c.chomage_brut || c.are_brut || 0,
        dividendes_an: c.dividendes_annuels || 0, loyers_nets_an: c.foncier_annuel || 0, heritage: c.heritage || 0
      },
      actuel: c.actuel, propose: res, variantes_ecart_mois: v, taux_point_mort: G.tauxPointMort(c) === null ? null : r2(G.tauxPointMort(c))
    };
    if (c.heritage) o.heritage = G.comparer(c).heritage.map(function (h) { return { montant: h.montant, garde_actuel: r2(h.actuel), garde_propose: r2(h.propose), ecart: r2(h.ecart) }; });
    return o;
  })
};
out(JSON.stringify(sortie, null, 1));
