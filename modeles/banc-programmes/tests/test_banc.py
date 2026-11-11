#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests du banc d'essai. Lancer : python3 -I modeles/banc-programmes/tests/test_banc.py   (ou -m unittest)."""
import os, random, sys, unittest

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ICI)
import moteur as M      # noqa: E402
import relancer as R    # noqa: E402

CTX = R.construire_ctx(False)


class TestLois(unittest.TestCase):
    def test_tri_bornes_et_mode(self):
        d = {'forme': 'tri', 'bas': 1.0, 'central': 2.0, 'haut': 5.0}
        self.assertAlmostEqual(M.quantile(d, 1e-9), 1.0, places=3)
        self.assertAlmostEqual(M.quantile(d, 1 - 1e-9), 5.0, places=3)
        self.assertAlmostEqual(M.quantile(d, (2.0 - 1.0) / (5.0 - 1.0)), 2.0, places=9)
        xs = [M.quantile(d, (i + 0.5) / 1000) for i in range(1000)]
        self.assertTrue(all(a <= b for a, b in zip(xs, xs[1:])))

    def test_lognorm_centiles(self):
        d = {'forme': 'lognorm', 'bas': 2.0, 'central': 4.0, 'haut': 8.0}
        self.assertAlmostEqual(M.quantile(d, 0.5), 4.0, places=9)
        self.assertAlmostEqual(M.quantile(d, 0.1), 2.0, places=6)
        self.assertAlmostEqual(M.quantile(d, 0.9), 8.0, places=6)

    def test_interpolation_trois_scenarios(self):
        self.assertAlmostEqual(M.trois_scenarios([10, 5, -2], 0.0), 5.0)
        self.assertAlmostEqual(M.trois_scenarios([10, 5, -2], M.Z90), -2.0)
        self.assertAlmostEqual(M.trois_scenarios([10, 5, -2], -M.Z90), 10.0)


class TestDette(unittest.TestCase):
    def test_dette_depart_coherente_avec_insee(self):
        # fin 2024 : 3 305,3 Md€ (Insee, 27/03/2025) ; déficit 2025 : 152,5 Md€ ; fin 2025 : 3 460,5 Md€ (Insee, 2026) : écart de flux < 0,2 % de la dette
        self.assertLess(abs(3305.3 + 152.5 - CTX['eco']['dette0']) / CTX['eco']['dette0'], 0.002)

    def test_moteur_retrouve_notre_systeme(self):
        v = R.test_validite(CTX)
        self.assertAlmostEqual(v['reference']['moteur_2038'], 1.3893, delta=0.001)    # 138,9 % après patrimoine à 1,25 % et grand ménage (DECISIONS1111D) ; 125,2 % (leviers F gardés, DECISIONS1111B ; 129,2 % avec leviers recalibrés) ; (après correction du différé et décisions du 11/11 : retraites de la loi de 2023, entreprise d'État à 1 Md€ ; 130,4 % avant)
        self.assertAlmostEqual(v['reference']['moteur_2058'], 1.5044, delta=0.001)    # 150,4 % (DECISIONS1111D) ; 108,2 % (DECISIONS1111B ; 128,9 % recalibré) ; (124,6 % avant les décisions du 11/11)
        for k, x in v.items():
            self.assertAlmostEqual(x['moteur_2038'], x['modele_2038'], delta=1e-6, msg=k)
            self.assertAlmostEqual(x['moteur_2058'], x['modele_2058'], delta=1e-6, msg=k)

    def test_amelioration_du_solde_baisse_la_dette(self):
        base = M.trajectoire_dette({}, CTX['eco'], CTX['macros']['reference'])
        mieux = M.trajectoire_dette({a: 30.0 for a in range(2028, 2059)}, CTX['eco'], CTX['macros']['reference'])
        self.assertLess(mieux[2038]['ratio'], base[2038]['ratio'])
        self.assertLess(mieux[2058]['ratio'], base[2058]['ratio'])


class TestModeles(unittest.TestCase):
    def test_retraites_cout_croissant_avec_l_avance(self):
        c = [M.levier_retraites_age(CTX, {'age_effectif': CTX['retraites']['ageBase2032'] - d})[1] for d in (0.5, 1.5, 2.5, 3.5)]
        self.assertTrue(all(a < b for a, b in zip(c, c[1:])))
        self.assertAlmostEqual(M.levier_retraites_age(CTX, {'age_effectif': 70.0})[1], 0.0)

    def test_ir_la_reaction_reduit_la_recette(self):
        p = {'tau_top': 0.75, 'rc': 0.6, 'calage': 1.0}
        statique = M.levier_ir(CTX, p, -M.Z90 * 10)[0]       # élasticité ~ 0
        reaction = M.levier_ir(CTX, p, M.Z90)[0]
        self.assertGreater(statique, reaction)

    def test_patrimoine_defavorable_inferieur_au_favorable(self):
        a = M.levier_isf(CTX, {'intensite': 1.0}, -M.Z90)[0]
        b = M.levier_isf(CTX, {'intensite': 1.0}, M.Z90)[0]
        self.assertGreater(a, b)
        self.assertGreater(M.levier_succession(CTX, {'taux_plat': 0.45, 'plafond': 12000000}, 0.0)[0], M.levier_succession(CTX, {'taux_plat': 0.20, 'plafond': 12000000}, 0.0)[0])


class TestMesures(unittest.TestCase):
    def test_format_des_mesures_lfi(self):
        prog, mesures, mod = R.charger_programme('lfi')
        ids = set()
        for m in mesures:
            for c in ('id', 'libelle', 'citation', 'lien', 'sens', 'levier', 'interpretation', 'hypotheses'):
                self.assertIn(c, m, '%s : champ %s manquant' % (m.get('id'), c))
            self.assertNotIn(m['id'], ids)
            ids.add(m['id'])
            self.assertTrue(m['lien'].startswith('https://'))
            self.assertIn(m['sens'], ('recette', 'depense'))
            for h in m['hypotheses']:
                self.assertEqual(len(h), 5)
                self.assertIn(h[3], 'ABCD')
            self.assertTrue(any(k in m for k in ('valeur', 'parametres', 'facteurs_produit')))

    def test_ordre_des_lois(self):
        prog, mesures, mod = R.charger_programme('lfi')
        def verifie(d, ident):
            if isinstance(d, dict) and d.get('forme') == 'tri':
                self.assertLessEqual(d['bas'], d['central'], ident)
                self.assertLessEqual(d['central'], d['haut'], ident)
        for m in mesures:
            verifie(m.get('valeur'), m['id'])
            for k, d in list(m.get('parametres', {}).items()) + list(m.get('facteurs_produit', {}).items()):
                verifie(d, m['id'] + k)

    def test_lfi_en_deficit_dans_tous_les_tirages(self):
        prog, mesures, mod = R.charger_programme('lfi')
        mesures = R.preparer(mesures, CTX)
        res, _ = R.simuler(prog, mesures, CTX, 300, R.GRAINE)
        self.assertTrue(all(s < 0 for s in res['solde']))

    def test_graine_fixe_reproductible(self):
        prog, mesures, mod = R.charger_programme('lfi')
        mesures = R.preparer(mesures, CTX)
        a, _ = R.simuler(prog, mesures, CTX, 200, 7)
        b, _ = R.simuler(prog, mesures, CTX, 200, 7)
        self.assertEqual(a['solde'], b['solde'])

    def test_les_lignes_non_modelisees_ne_changent_pas_sans_correlation(self):
        # avec rho = 0, la médiane du solde reste proche de celle avec les corrélations de référence (les corrélations élargissent l'intervalle, pas le centre)
        prog, mesures, mod = R.charger_programme('lfi')
        mesures = R.preparer(mesures, CTX)
        a, _ = R.simuler(prog, mesures, CTX, 1500, 3, 1.0)
        b, _ = R.simuler(prog, mesures, CTX, 1500, 3, 0.0)
        self.assertLess(abs(M.centile(a['solde'], 0.5) - M.centile(b['solde'], 0.5)), 10.0)
        self.assertGreater(M.centile(a['solde'], 0.9) - M.centile(a['solde'], 0.1), 0.9 * (M.centile(b['solde'], 0.9) - M.centile(b['solde'], 0.1)))


class TestNouvellesMesures(unittest.TestCase):
    """Smic, pension minimale, carburants, nationalisations (leviers2.py)."""
    P_SMIC = {'hausse': 0.178, 'mediane': 2900.0, 'part_smic': 0.124, 'n_prive': 17.7, 'etp': 0.88, 'diffusion': 0.3, 'indexation_allegement': 1.0, 'eps': 0.25, 'allocation': 8000.0,
              'part_agents': 0.025, 'masse_publique': 370.0, 'deja_point': 1.10, 'masse_financee': 70.0, 'part_financee': 0.2, 'part_publique': 0.8, 'pec': 100.0, 'cout_pec': 15000.0, 'taux_pec': 0.55}

    def test_reduction_generale_reproduit_openfisca(self):
        g = CTX['smic']['grille']['seul']
        for i, w in enumerate(g['salaires']):
            self.assertAlmostEqual(M.L2.reduction_generale(w, M.L2.SMIC0) * 12, g['allegement_general'][i], delta=3.0, msg=str(w))

    def test_smic_sans_hausse_aucun_effet(self):
        p = dict(self.P_SMIC, hausse=0.0)
        r = M.L2.calcul_smic(CTX, p)
        self.assertAlmostEqual(r['recettes'], 0.0, places=6)
        self.assertAlmostEqual(r['depenses'], 0.0, places=6)

    def test_smic_indexation_des_allegements_coute_aux_finances_publiques(self):
        a = M.L2.calcul_smic(CTX, dict(self.P_SMIC, indexation_allegement=1.0))
        b = M.L2.calcul_smic(CTX, dict(self.P_SMIC, indexation_allegement=0.0))
        self.assertLess(a['recettes'], b['recettes'])                  # allègements indexés : moins de recettes
        self.assertLess(a['emplois_perdus_k'], b['emplois_perdus_k'])  # mais moins d'emplois perdus (le coût du travail monte moins)
        self.assertGreater(a['d_allegements'], 0.0)

    def test_smic_plus_d_elasticite_plus_d_emplois_perdus(self):
        a = M.L2.calcul_smic(CTX, dict(self.P_SMIC, eps=0.1))['emplois_perdus_k']
        b = M.L2.calcul_smic(CTX, dict(self.P_SMIC, eps=0.4))['emplois_perdus_k']
        self.assertAlmostEqual(b / a, 4.0, places=6)

    def test_pension_minimale_croissante_avec_le_seuil(self):
        c = [M.L2.cout_pension_minimale(CTX, {'seuil': s, 'part_cc': 0.62})[0] for s in (1200.0, 1500.0, 1700.0, 2000.0)]
        self.assertTrue(all(a < b for a, b in zip(c, c[1:])))
        self.assertAlmostEqual(M.L2.cout_pension_minimale(CTX, {'seuil': 0.0, 'part_cc': 0.62})[0], 0.0)
        self.assertLess(M.L2.cout_pension_minimale(CTX, {'seuil': 1700.0, 'part_cc': 0.62})[2], 1.0)

    def test_carburant_nul_sous_le_plafond_et_croissant_au_dessus(self):
        base = {'plafond': 1.70, 'volume': 47.5, 'part_plafonnee': 1.0, 'elasticite': 0.15, 'marge': 0.15, 'prix': 1.60}
        self.assertEqual(M.L2.calcul_carburant(base)['public'], 0.0)
        c = [M.L2.calcul_carburant(dict(base, prix=x))['public'] for x in (1.80, 2.00, 2.30)]
        self.assertEqual(c[0], 0.0)                                    # écart de 0,10 < marge de 0,15 : absorbé par le privé
        self.assertTrue(0.0 < c[1] < c[2])
        t = M.L2.calcul_carburant(dict(base, prix=2.14))
        self.assertAlmostEqual(t['public'] + t['prive'], t['total'], places=9)

    def test_nationalisation_est_une_operation_financiere(self):
        prog, mesures, mod = R.charger_programme('lfi')
        nat = [m for m in mesures if m['levier'] == 'nationalisation' and m['id'] == 'N04'][0]
        t = {'z': {}, 'zi': {}}
        ops = [(nat,) + M.operation_capital(nat, t)]
        self.assertGreater(ops[0][1], 30.0)
        serie = M.serie_effet([(nat,) + M.mediane_mesure(nat, CTX)], prog, ops)
        self.assertGreaterEqual(min(v[1] for v in serie.values()), 0.0)             # aucune dépense : pas de déficit
        chocs = M.chocs_dette(ops, prog)
        self.assertAlmostEqual(sum(chocs.values()), ops[0][1], places=9)
        eff = {an: v[2] for an, v in serie.items()}
        avec = M.trajectoire_dette(eff, CTX['eco'], CTX['macros']['reference'], chocs=chocs)
        sans = M.trajectoire_dette(eff, CTX['eco'], CTX['macros']['reference'])
        self.assertGreater(avec[2038]['ratio'], sans[2038]['ratio'])

    def test_transfert_en_capital_est_une_depense(self):
        prog, mesures, mod = R.charger_programme('lfi')
        nat = [m for m in mesures if m['id'] == 'N06'][0]
        ops = [(nat, 10.0, 1.0)]
        serie = M.serie_effet([], prog, ops)
        self.assertAlmostEqual(sum(v[1] for v in serie.values()), 10.0, places=9)
        self.assertTrue(all(abs(v) < 1e-12 for v in M.chocs_dette(ops, prog).values()))

    def test_autoroutes_flux_s_arrete_en_2035(self):
        prog, mesures, mod = R.charger_programme('lfi')
        nat = [m for m in mesures if m['id'] == 'N02'][0]
        serie = M.serie_effet([(nat, 5.0, 0.0)], prog)
        self.assertGreater(serie[2035][0], 0.0)
        self.assertEqual(serie[2036][0], 0.0)

    def test_isf_et_plancher_partagent_l_intensite(self):
        prog, mesures, mod = R.charger_programme('lfi')
        a = [m for m in mesures if m['id'] == 'R01a'][0]['parametres']['intensite']
        b = [m for m in mesures if m['id'] == 'R04'][0]['parametres']['intensite']
        self.assertEqual((a['facteur'], b['facteur']), ('isf', 'isf'))
        self.assertGreaterEqual(min(a['lambda'], b['lambda']), 0.9)

class TestRN(unittest.TestCase):
    def test_loi_med_mediane_et_bornes(self):
        d = {'forme': 'med', 'bas': 0.0, 'central': 2.0, 'haut': 12.2}
        self.assertAlmostEqual(M.quantile(d, 0.5), 2.0, places=9)
        self.assertAlmostEqual(M.quantile(d, 1e-9), 0.0, places=6)
        self.assertAlmostEqual(M.quantile(d, 1 - 1e-9), 12.2, places=5)
        xs = [M.quantile(d, (i + 0.5) / 1000) for i in range(1000)]
        self.assertTrue(all(a <= b for a, b in zip(xs, xs[1:])))

    def test_format_des_mesures_rn(self):
        prog, mesures, mod = R.charger_programme('rn')
        ids = [m['id'] for m in mesures]
        self.assertEqual(len(ids), len(set(ids)))
        for m in mesures:
            for cle in ('id', 'libelle', 'citation', 'lien', 'sens', 'levier', 'interpretation', 'hypotheses', 'theme', 'annonce'):
                self.assertIn(cle, m, (m['id'], cle))
            self.assertIn(m['sens'], ('recette', 'depense'))
            for h in m['hypotheses']:
                self.assertEqual(len(h), 5)
                self.assertIn(h[3], 'ABCD')
            if m['sens'] == 'recette' and isinstance(m.get('valeur'), dict) and m['valeur']['forme'] == 'med':
                v = m['valeur']
                self.assertLessEqual(v['bas'], v['central'])
                self.assertLessEqual(v['central'], v['haut'])
                self.assertLessEqual(v['haut'], m['annonce'] + 1e-9, 'la borne haute d\'une économie ne dépasse pas l\'annonce : ' + m['id'])

    def test_ir_jeunes_croissant_avec_le_salaire_median(self):
        import leviers_rn as LR
        g = CTX['rn_openfisca']
        self.assertLess(LR.ir_moyen_jeunes(g, 1.1, 0.4), LR.ir_moyen_jeunes(g, 1.5, 0.4))
        self.assertEqual(LR.ir_seul(g, 1802.0), 0.0)

    def test_iff_net_de_l_ifi(self):
        import leviers_rn as LR
        r, d = LR.levier_iff(CTX, {'part_fin': 0.0}, 0.0)
        self.assertAlmostEqual(r, -CTX['ifi_actuel'])
        r2, _ = LR.levier_iff(CTX, {'part_fin': 0.5}, 0.0)
        self.assertGreater(r2, r)

    def test_rn_resultats_coherents(self):
        prog, mesures, mod = R.charger_programme('rn')
        res = R.sortie_programme(prog, mesures, CTX, 1500, R.GRAINE)
        self.assertLess(res['solde_regime']['p10'], res['solde_regime']['p50'])
        self.assertLess(res['solde_regime']['p50'], res['solde_regime']['p90'])
        self.assertGreater(res['dette2038']['p50'], 1.0)


class TestSystemeAvecIncertitudes(unittest.TestCase):
    """Notre système passé dans le banc avec la même méthode que LFI et le RN (modules à bornes, facteurs communs, Monte-Carlo)."""
    @classmethod
    def setUpClass(cls):
        cls.prog, cls.mesures, _ = R.charger_programme('langagement')
        cls.res = R.sortie_systeme(cls.prog, cls.mesures, CTX, 2000, R.GRAINE)

    def test_modules_ordre_favorable_central_defavorable(self):
        self.assertGreaterEqual(len(self.mesures), 25)
        for m in self.mesures:
            self.assertEqual(len(m['d_fav']), 30, m['id'])
            for f_, d_ in zip(m['d_fav'], m['d_def']):
                self.assertGreaterEqual(f_, -1e-9, m['id'])
                self.assertLessEqual(d_, 1e-9, m['id'])

    def test_ecarts_nuls_redonnent_le_modele(self):
        s = CTX['systeme']['systeme']
        eff = M.effet_systeme_md(s['reference'], CTX['eco'])
        t0 = {'z': {}, 'zi': {}}
        delta, rec, par = M.effet_modules(self.mesures, t0, [2029 + k for k in range(30)])
        self.assertTrue(all(abs(x) < 1e-12 for x in delta))
        tr = M.trajectoire_dette({an: eff[an] + delta[i] for i, an in enumerate(range(2029, 2059))}, CTX['eco'], CTX['macros']['reference'])
        self.assertAlmostEqual(tr[2038]['ratio'], 1.3893, delta=0.0005)       # 138,9 % après patrimoine à 1,25 % et grand ménage (DECISIONS1111D) ; 125,2 % (DECISIONS1111B ; 129,2 % recalibré) ; : valeur centrale du modèle (après correction du différé V32018 et décisions du 11/11 ; 130,4 % avant)
        self.assertAlmostEqual(tr[2058]['ratio'], 1.5044, delta=0.0005)       # 150,4 % (DECISIONS1111D) ; 108,2 % (DECISIONS1111B ; 128,9 % recalibré) ; (124,6 % avant les décisions du 11/11)

    def test_mediane_proche_de_la_valeur_centrale(self):
        c = self.res['central']
        self.assertAlmostEqual(self.res['dette2038']['p50'], c['dette2038'], delta=0.01)       # à moins de 1 point de dette 2038
        self.assertAlmostEqual(self.res['solde_regime']['p50'], c['solde_2038'], delta=6.0)    # à 6 Md€ près (bornes asymétriques)

    def test_intervalle_a_80_pour_cent_present_et_ordonne(self):
        for k in ('solde_regime', 'po_pct', 'dep_pct', 'deficit2038_pct', 'dette2038', 'dette2058'):
            d = self.res[k]
            self.assertLess(d['p10'], d['p50'])
            self.assertLess(d['p50'], d['p90'])
        # même forme que pour LFI et le RN : mêmes clés
        self.assertTrue({'solde_regime', 'recettes_regime', 'depenses_regime', 'po_pct', 'dep_pct', 'deficit2038_pct', 'dette2038', 'dette2058', 'dette2038_rel', 'dette2058_rel', 'extremes', 'sensibilite_rho'} <= set(self.res))

    def test_plus_de_saut_en_2041_apres_correction_du_double_compte(self):
        s = CTX['systeme']['systeme']
        eff = M.effet_systeme_md(s['reference'], CTX['eco'])
        self.assertLess(abs(eff[2041] - eff[2040]), 3.0)    # avant la correction : +25,0 (13,5 de pbStruct + 11,5 de l'ajustement des plafonds, H537 : V32012) ; un seul report étalé depuis (V32018)
        self.assertLess(abs(eff[2040] - eff[2039]), 3.0)
        self.assertLess(abs(eff[2042] - eff[2041]), 3.0)

    def test_ordre_des_poids(self):
        cv = self.res['contribution_variance']
        self.assertAlmostEqual(sum(cv.values()), 1.0, places=6)


class TestVarianteMoinsSevere(unittest.TestCase):
    """Variante « modèles moins sévères » (exil et évasion des grandes fortunes) : monotone, et sans effet sur les autres leviers."""
    @classmethod
    def setUpClass(cls):
        cls.ms = R.ctx_moins_severe(CTX)

    def test_isf_plus_rentable_quand_l_erosion_baisse(self):
        for nom in ('sobre', 'renforce'):
            for k in range(3):
                self.assertGreater(self.ms['systeme']['isf'][nom][k]['recette'], CTX['systeme']['isf'][nom][k]['recette'])

    def test_transmissions_plus_rentables(self):
        for n in ('plat20', 'plat35', 'plat45'):
            for k in range(3):
                self.assertGreater(self.ms['systeme']['succession'][n][k]['netActuel'], CTX['systeme']['succession'][n][k]['netActuel'])

    def test_autres_blocs_inchanges(self):
        self.assertEqual(self.ms['systeme']['systeme'], CTX['systeme']['systeme'])
        self.assertEqual(self.ms['openfisca'], CTX['openfisca'])

    def test_modules_systeme_decales_et_central_deplace(self):
        import programmes.langagement.mesures as _  # noqa: F401  (chemin)
        prog, mesures, mod = R.charger_programme('langagement')
        nouv = {m['id']: m for m in R.mesures_systeme_moins_severes(mesures)}
        anc = {m['id']: m for m in mesures}
        for i in ('M-PAT', 'M-TRANS'):
            self.assertIn('d_c', nouv[i])
            self.assertGreater(nouv[i]['central'], anc[i]['central'])
        self.assertNotIn('d_c', nouv['M-REV'])


class TestAjouts0911(unittest.TestCase):
    """Programmes ajoutés le 09/11/2026 (Les Républicains : plan Retailleau ; PS et Place publique : contre-budget 2027) : format, leviers, et non-régression des programmes déjà publiés."""
    def test_format_des_mesures_lr_ps(self):
        for cle in ('lr', 'ps'):
            prog, mesures, mod = R.charger_programme(cle)
            self.assertEqual(prog['cle'], cle)
            ids = [m['id'] for m in mesures]
            self.assertEqual(len(ids), len(set(ids)))
            for m in mesures:
                for k in ('id', 'libelle', 'citation', 'lien', 'sens', 'levier', 'interpretation', 'hypotheses', 'theme', 'annonce', 'montee'):
                    self.assertIn(k, m, (cle, m['id'], k))
                self.assertIn(m['sens'], ('recette', 'depense'))
                self.assertEqual(len(m['montee']), 5)
                for h in m['hypotheses']:
                    self.assertEqual(len(h), 5)
                    self.assertIn(h[3], 'ABCD')
                if m['sens'] == 'recette' and isinstance(m.get('valeur'), dict) and m['valeur']['forme'] == 'med':
                    v = m['valeur']
                    self.assertLessEqual(v['bas'], v['central'])
                    self.assertLessEqual(v['central'], v['haut'])
                    self.assertLessEqual(v['haut'], m['annonce'] + 1e-9, (cle, m['id']))
                M.mediane_mesure(m, CTX)          # chaque levier s'évalue

    def test_annonces_retailleau_somment_a_197_et_51(self):
        prog, mesures, mod = R.charger_programme('lr')
        eco = sum(m['annonce'] for m in mesures if m['sens'] == 'recette')
        baisses = sum(m['annonce'] for m in mesures if m['sens'] == 'depense')
        self.assertAlmostEqual(eco, 197.0, places=6)
        self.assertAlmostEqual(baisses, 51.0, places=6)

    def test_zucman_sans_isf_ordonne_et_branche_sur_le_module(self):
        fav, _ = M.levier_zucman(CTX, -M.Z90)
        cen, _ = M.levier_zucman(CTX, 0.0)
        dfv, _ = M.levier_zucman(CTX, M.Z90)
        self.assertGreater(fav, cen)
        self.assertGreater(cen, dfv)
        self.assertAlmostEqual(cen, CTX['systeme']['zucman_droit_actuel'][1]['net'])

    def test_smic_du_ps_meme_methode_que_lfi(self):
        _, ps, _ = R.charger_programme('ps')
        _, lfi, _ = R.charger_programme('lfi')
        p_ps = [m for m in ps if m['levier'] == 'smic'][0]['parametres']
        p_lfi = [m for m in lfi if m['id'] == 'S01'][0]['parametres']
        self.assertEqual(set(p_ps), set(p_lfi))
        for k in p_lfi:
            if k != 'hausse':
                self.assertEqual(p_ps[k], p_lfi[k], k)
        self.assertLess(p_ps['hausse']['central'], p_lfi['hausse']['central'])

    def test_ajout_ne_change_pas_les_tirages_des_autres(self):
        """Chaque programme a son générateur (même graine) : le RN tiré seul ou après les deux nouveaux programmes donne exactement les mêmes valeurs."""
        prog, mesures, _ = R.charger_programme('rn')
        a = R.simuler(prog, R.preparer([dict(m) for m in mesures], CTX), CTX, 300, R.GRAINE)[0]['solde']
        for cle in ('lr', 'ps', 'gl'):
            p2, m2, _ = R.charger_programme(cle)
            R.simuler(p2, R.preparer(m2, CTX), CTX, 50, R.GRAINE)
        b = R.simuler(prog, R.preparer([dict(m) for m in mesures], CTX), CTX, 300, R.GRAINE)[0]['solde']
        self.assertEqual(a, b)

    def test_medianes_publiees_inchangees(self):
        """Non-régression : médianes publiées le 08/11/2026 (10 000 tirages) de LFI, du RN, de notre système et du fil de l'eau, relues dans donnees/resultats.json."""
        import json
        with open(os.path.join(ICI, 'donnees', 'resultats.json'), encoding='utf-8') as fh:
            d = json.load(fh)
        if d.get('tirages') != 10000:
            self.skipTest('resultats.json écrit avec un autre nombre de tirages')
        ref = {'fil_de_l_eau': (0.0, 1.5711708855002064, 2.4024247759491457), 'lfi': (-246.54402462535268, 2.3988604883779097, 5.033879542457721),
               'rn': (-33.006621364136365, 1.6993619662555024, 2.7689943635342606), 'langagement': (97.14158397954537, 1.3887243500962614, 1.4876927920644996)}   # notre système : valeurs du 11/11/2026 après patrimoine à 1,25 % et grand ménage (DECISIONS1111D ; avant : 135.607, 1.2538, 1.0736 du 08/11)   # RN : valeurs du 11/11/2026 après relecture du dossier primaire (lignes H06, F04, F07, G03, T04 corrigées ; avant : (-32.38031474628301, 1.6972359229649188, 2.762665687819363)) ; notre système : valeurs du 11/11/2026 après DECISIONS1111B (gains d'abord au déficit, leviers F gardés) ; avant : (111.92531291221965, 1.293404077100781, 1.2781484333744682) avec leviers recalibrés ; (retraites de la loi de 2023, entreprise d'État à 1 Md€) ; 08/11 : (114.4749468129349, 1.305629154545636, 1.218767228450166)

        for cle, (s, d38, d58) in ref.items():
            self.assertAlmostEqual(d[cle]['solde_regime']['p50'], s, places=9, msg=cle)
            self.assertAlmostEqual(d[cle]['dette2038']['p50'], d38, places=12, msg=cle)
            self.assertAlmostEqual(d[cle]['dette2058']['p50'], d58, places=12, msg=cle)


if __name__ == '__main__':
    unittest.main(verbosity=1)
